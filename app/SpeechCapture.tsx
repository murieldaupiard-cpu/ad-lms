"use client";
import {useEffect,useSyncExternalStore} from "react";
import {cancelCapture,getCaptureState,subscribeCapture} from "@/lib/speech-capture";
import "./speech-capture.css";
export default function SpeechCapture(){
  const state=useSyncExternalStore(subscribeCapture,getCaptureState,()=>null);
  const open=Boolean(state);
  useEffect(()=>{
    if(!open)return;
    const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")cancelCapture();};
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[open]);
  if(!state)return null;
  return <section className="speech-capture" aria-labelledby="speech-title">
    <h2 id="speech-title">{state?.phase==="permission"?"Autoriser le microphone":state?.phase==="error"?"Transcription indisponible":state?.phase==="transcribing"?"Transcription en cours…":"Je vous écoute…"}</h2>
    <p aria-live="polite">{state?.phase==="permission"?"Acceptez la demande du navigateur. Sur téléphone, ouvrez CADGA directement dans Safari ou Chrome.":state?.phase==="error"?"Le service de transcription ne répond pas. Vous pouvez réessayer avec la reconnaissance vocale de votre navigateur, puis redire votre réponse.":state?.phase==="transcribing"?"Votre enregistrement est terminé. Patientez quelques instants.":"Parlez en anglais. Une pause de 2 secondes termine la réponse automatiquement."}</p>
    {state?.phase==="error"&&state.retry&&<button className="speech-finish" onClick={state.retry}>Réessayer avec le navigateur</button>}
    {state?.phase==="recording"&&<><meter min="0" max="1" value={state.level} aria-label="Niveau sonore du microphone"/><p className="speech-timer">{state.seconds} / 20 s</p><button className="speech-finish" onClick={state.stop}>Valider maintenant</button></>}
    <button className="speech-cancel" onClick={cancelCapture}>Annuler</button>
    <small>Votre réponse audio est envoyée à ElevenLabs pour la transcrire et vérifier l’exercice.</small>
  </section>;
}
