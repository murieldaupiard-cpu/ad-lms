import {RecorderRecognition,recordingSupported,cancelCapture} from "./speech-capture";
export type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: null | (() => void);
  onresult: null | ((event: any) => void);
  onerror: null | ((event: any) => void);
  onend: null | (() => void);
  start: () => void;
  stop: () => void;
  abort?: () => void;
};

let activeRecognition: SpeechRecognitionLike | null = null;
export function cancelSpeechRecognition() {
  cancelCapture();
  activeRecognition?.abort?.();
  activeRecognition = null;
}

export function speechRecognitionSupported() {
  if (typeof window === "undefined") return false;
  const w = window as any;
  return recordingSupported() || Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

// Browser recognition first (the original, simple flow: no dialog, the answer is checked as soon as the
// learner stops talking). The recorded/server transcription is only used where the browser has no
// recognition (e.g. Firefox) or when the browser service refuses to work (network, blocked service).
const FALLBACK_ERRORS=new Set(["network","service-not-allowed","language-not-supported"]);
export function createSpeechRecognition(lang = "en-GB"): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const native=createNativeSpeechRecognition(lang,recordingSupported()?()=>{const r=new RecorderRecognition();r.lang=lang;return r;}:undefined);
  if (native) return native;
  if (recordingSupported()) {const recorder=new RecorderRecognition();recorder.lang=lang;return recorder;}
  return null;
}

/**
 * Spelling letter by letter: browser recognition (Safari especially) merges spelled letters into a word
 * ("W I L S O N" → "WILSON"), so spelling uses the recorded transcription, which keeps every letter.
 * It runs inline (no dialog) and stops by itself after a short silence.
 */
export function createSpellingRecognition(lang = "en-GB"): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  if (recordingSupported()) {const r=new RecorderRecognition();r.lang=lang;r.inline=true;return r;}
  return createNativeSpeechRecognition(lang);
}

function createNativeSpeechRecognition(lang:string,fallback?:()=>SpeechRecognitionLike):SpeechRecognitionLike|null {
  const w = window as any;
  const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Recognition) return null;
  const recognition: SpeechRecognitionLike = new Recognition();
  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 10;
  // Keep native start synchronous with the tap, and report every terminal path.
  let finished = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let hasResult = false;
  const wrapper: SpeechRecognitionLike = {
    lang, interimResults:false, continuous:false, maxAlternatives:10,
    onstart:null,onresult:null,onerror:null,onend:null,
    start() {
      cancelSpeechRecognition(); activeRecognition = wrapper;
      finished = false; hasResult = false;
      recognition.lang = wrapper.lang; recognition.interimResults = wrapper.interimResults;
      recognition.continuous = wrapper.continuous; recognition.maxAlternatives = wrapper.maxAlternatives;
      timer = setTimeout(() => { finish("no-speech"); recognition.abort?.(); },25000);
      try { recognition.start(); } catch (error) { finish(error instanceof Error ? error.name : "audio-capture"); }
    },
    stop() { try { recognition.stop(); } catch { finish("aborted"); } },
    abort() { finish("aborted"); try { recognition.abort?.(); } catch {} },
  };
  function finish(error?: string) {
    if (finished) return;
    finished = true; clearTimeout(timer);
    if (activeRecognition === wrapper) activeRecognition = null;
    if (error) wrapper.onerror?.({error});
    wrapper.onend?.();
  }
  recognition.onstart = () => { if (!finished) wrapper.onstart?.(); };
  recognition.onresult = event => {
    if (finished) return;
    if (!event.results?.[0]?.length) { finish("no-speech"); return; }
    hasResult = true; wrapper.onresult?.(event); finish();
  };
  recognition.onerror = event => {
    const error=event?.error || "audio-capture";
    if (!finished && !hasResult && fallback && FALLBACK_ERRORS.has(error)) {
      // Hand over to the recorded transcription, keeping the exercise's callbacks.
      finished=true; clearTimeout(timer); if (activeRecognition === wrapper) activeRecognition = null;
      const other=fallback();
      other.maxAlternatives=wrapper.maxAlternatives;
      other.onstart=()=>wrapper.onstart?.(); other.onresult=e=>wrapper.onresult?.(e);
      other.onerror=e=>wrapper.onerror?.(e); other.onend=()=>wrapper.onend?.();
      other.start(); return;
    }
    finish(error);
  };
  recognition.onend = () => finish(hasResult ? undefined : "no-speech");
  return wrapper;
}

export async function requestMicrophoneAccess(): Promise<{ok: boolean; error?: string}> {
  if (typeof window === "undefined") return {ok:false,error:"unavailable"};
  if (!window.isSecureContext) return {ok:false,error:"insecure"};
  if (!navigator.mediaDevices?.getUserMedia) return {ok:false,error:"unsupported"};
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    stream.getTracks().forEach(track => track.stop());
    return {ok:true};
  } catch (error:any) {
    return {ok:false,error:error?.name || "not-allowed"};
  }
}

export function speechErrorMessage(error?: string) {
  switch (error) {
    case "NotAllowedError":
    case "PermissionDeniedError":
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access is blocked. Allow microphone access for this site in your browser settings, then try again.";
    case "NotFoundError":
    case "DevicesNotFoundError":
    case "audio-capture":
      return "No working microphone was found. Check the device microphone and try again.";
    case "NotReadableError":
    case "TrackStartError":
      return "Your microphone is being used by another app. Close the other app and try again.";
    case "insecure":
      return "The microphone requires a secure HTTPS connection.";
    case "unsupported":
    case "unavailable":
      return "Open CADGA directly in Safari on iPhone or Chrome on Android (not inside a messaging app), then allow the microphone.";
    case "network":
      return "Voice recognition could not reach the recognition service. Check your internet connection and try again.";
    case "permission-timeout":
      return "Microphone permission is still pending. Allow access in your browser, then try again.";
    case "transcription-unavailable":
    case "transcription-permission":
    case "transcription-quota":
      return "The transcription service is temporarily unavailable. Please try again shortly.";
    case "rate-limited":
      return "The voice service is busy. Please wait a minute and try again.";
    case "recording-too-large":
    case "invalid-audio":
      return "The recording could not be read. Please record a shorter answer and try again.";
    case "no-speech":
      return "I didn't hear any speech. Move closer to the microphone and try again.";
    case "aborted":
      return "Voice recognition stopped. Press the microphone and try again.";
    default:
      return "I couldn't hear you clearly. Check microphone permission and try again.";
  }
}

export function prepareSpeechRecognition(lang = "en-GB") {
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return {recognition:null as SpeechRecognitionLike|null,error:speechErrorMessage("insecure")};
  }
  if (!speechRecognitionSupported()) {
    return {recognition:null as SpeechRecognitionLike|null, error:"Voice recognition is not supported in this browser. Try the latest Chrome, Edge or Safari."};
  }
  // Let recognition request its own microphone permission directly from the tap.
  // Opening and stopping a separate stream first loses mobile user activation.
  return {recognition:createSpeechRecognition(lang),error:null as string|null};
}
