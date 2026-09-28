// Appel en direct avec un agent ElevenLabs (protocole WebSocket de Conversational AI) :
// le micro est envoyé en PCM 16 bits, la voix de l'appelant est jouée au fur et à mesure,
// et les répliques transcrites des deux côtés sont remontées à la page.

export type Line = {role: "caller" | "learner"; text: string};
export type CallEvents = {
  onStatus: (s: "connecting" | "live" | "ended" | "error", detail?: string) => void;
  onLine: (line: Line) => void;
  onSpeaking: (speaking: boolean) => void;
  onLevel: (level: number) => void;
};

const WORKLET = `class C extends AudioWorkletProcessor{process(i){const c=i[0]&&i[0][0];if(c)this.port.postMessage(c.slice(0));return true}}registerProcessor("pcm-capture",C)`;

function toBase64(bytes: Uint8Array) { let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(s); }
function fromBase64(b64: string) { const s = atob(b64); const out = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i); return out; }
function resample(input: Float32Array, from: number, to: number) {
  if (from === to) return input;
  const ratio = from / to, out = new Float32Array(Math.floor(input.length / ratio));
  for (let i = 0; i < out.length; i++) out[i] = input[Math.floor(i * ratio)];
  return out;
}

export class LiveCall {
  private ws?: WebSocket; private stream?: MediaStream; private inCtx?: AudioContext; private outCtx?: AudioContext;
  private node?: AudioWorkletNode; private pending: Float32Array[] = []; private pendingLength = 0;
  private inputRate = 16000; private outputRate = 16000; private playhead = 0; private sources = new Set<AudioBufferSourceNode>();
  private speakingTimer?: ReturnType<typeof setTimeout>; private ended = false;
  conversationId = "";
  constructor(private events: CallEvents) {}

  async start(signedUrl: string) {
    this.events.onStatus("connecting");
    // Micro et sortie audio ouverts depuis le clic (activation utilisateur, indispensable sur mobile).
    this.stream = await navigator.mediaDevices.getUserMedia({audio: {echoCancellation: true, noiseSuppression: true, autoGainControl: true}});
    const Ctx = window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
    this.inCtx = new Ctx(); this.outCtx = new Ctx();
    await Promise.all([this.inCtx.resume(), this.outCtx.resume()]);
    const url = URL.createObjectURL(new Blob([WORKLET], {type: "application/javascript"}));
    await this.inCtx.audioWorklet.addModule(url); URL.revokeObjectURL(url);
    const source = this.inCtx.createMediaStreamSource(this.stream);
    this.node = new AudioWorkletNode(this.inCtx, "pcm-capture");
    this.node.port.onmessage = (e: MessageEvent<Float32Array>) => this.capture(e.data);
    source.connect(this.node);

    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(signedUrl); this.ws = ws;
      ws.onopen = () => { ws.send(JSON.stringify({type: "conversation_initiation_client_data"})); resolve(); };
      ws.onerror = () => { if (!this.ended) { this.events.onStatus("error", "network"); reject(new Error("network")); } };
      ws.onclose = () => { if (!this.ended) this.finish(); };
      ws.onmessage = e => this.message(e.data);
    });
  }

  private capture(frame: Float32Array) {
    if (!this.inCtx || !this.ws || this.ws.readyState !== WebSocket.OPEN || !this.conversationId) return;
    let peak = 0; for (let i = 0; i < frame.length; i += 8) peak = Math.max(peak, Math.abs(frame[i]));
    this.events.onLevel(Math.min(1, peak * 3));
    const data = resample(frame, this.inCtx.sampleRate, this.inputRate);
    this.pending.push(data); this.pendingLength += data.length;
    if (this.pendingLength < this.inputRate / 10) return; // ~100 ms par envoi
    const pcm = new Int16Array(this.pendingLength); let o = 0;
    for (const chunk of this.pending) for (let i = 0; i < chunk.length; i++) { const v = Math.max(-1, Math.min(1, chunk[i])); pcm[o++] = v < 0 ? v * 0x8000 : v * 0x7fff; }
    this.pending = []; this.pendingLength = 0;
    this.ws.send(JSON.stringify({user_audio_chunk: toBase64(new Uint8Array(pcm.buffer))}));
  }

  private message(raw: string) {
    let m: any; try { m = JSON.parse(raw); } catch { return; }
    switch (m.type) {
      case "conversation_initiation_metadata": {
        const meta = m.conversation_initiation_metadata_event || {};
        this.conversationId = meta.conversation_id || "";
        const rate = (f: string | undefined) => Number(/pcm_(\d+)/.exec(f || "")?.[1]) || 16000;
        this.outputRate = rate(meta.agent_output_audio_format); this.inputRate = rate(meta.user_input_audio_format);
        this.events.onStatus("live");
        break;
      }
      case "ping": this.ws?.send(JSON.stringify({type: "pong", event_id: m.ping_event?.event_id})); break;
      case "audio": if (m.audio_event?.audio_base_64) this.play(m.audio_event.audio_base_64); break;
      case "interruption": this.stopPlayback(); break;
      case "agent_response": if (m.agent_response_event?.agent_response) this.events.onLine({role: "caller", text: m.agent_response_event.agent_response}); break;
      case "user_transcript": if (m.user_transcription_event?.user_transcript) this.events.onLine({role: "learner", text: m.user_transcription_event.user_transcript}); break;
    }
  }

  private play(b64: string) {
    if (!this.outCtx) return;
    const bytes = fromBase64(b64); const pcm = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
    const buffer = this.outCtx.createBuffer(1, pcm.length, this.outputRate); const ch = buffer.getChannelData(0);
    for (let i = 0; i < pcm.length; i++) ch[i] = pcm[i] / 0x8000;
    const src = this.outCtx.createBufferSource(); src.buffer = buffer; src.connect(this.outCtx.destination);
    const at = Math.max(this.outCtx.currentTime + 0.02, this.playhead); src.start(at); this.playhead = at + buffer.duration;
    this.sources.add(src); src.onended = () => this.sources.delete(src);
    this.events.onSpeaking(true); clearTimeout(this.speakingTimer);
    this.speakingTimer = setTimeout(() => this.events.onSpeaking(false), (this.playhead - this.outCtx.currentTime) * 1000 + 150);
  }
  private stopPlayback() { this.sources.forEach(s => { try { s.stop(); } catch {} }); this.sources.clear(); this.playhead = 0; this.events.onSpeaking(false); }

  hangUp() { this.finish(); }
  private finish() {
    if (this.ended) return; this.ended = true;
    try { this.ws?.close(); } catch {}
    this.stopPlayback(); clearTimeout(this.speakingTimer);
    this.stream?.getTracks().forEach(t => t.stop());
    this.node?.disconnect();
    void this.inCtx?.close().catch(() => {}); void this.outCtx?.close().catch(() => {});
    this.events.onStatus("ended");
  }
}
