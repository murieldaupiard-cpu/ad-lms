"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {cancelSpeechRecognition} from "@/lib/speech-recognition";

export default function SpeechLifecycle() {
  const pathname = usePathname();
  useEffect(() => {
    const onHidden = () => { if (document.hidden) cancelSpeechRecognition(); };
    document.addEventListener("visibilitychange",onHidden);
    window.addEventListener("pagehide",cancelSpeechRecognition);
    return () => {
      document.removeEventListener("visibilitychange",onHidden);
      window.removeEventListener("pagehide",cancelSpeechRecognition);
      cancelSpeechRecognition();
    };
  },[pathname]);
  return null;
}
