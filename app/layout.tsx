import type { Metadata } from "next";
import "./globals.css";
import ModuleHomeButton from "./ModuleHomeButton";
import SpeechLifecycle from "./SpeechLifecycle";
import SpeechCapture from "./SpeechCapture";

export const metadata: Metadata = {
  metadataBase: new URL("https://cadga-lms.muriel-daupiard.chatgpt.site"),
  title: "AD LMS",
  description: "L’espace d’apprentissage de l’anglais professionnel des Assistants de Direction.",
  openGraph: {
    title: "AD LMS",
    description: "L’anglais professionnel en action.",
    images: [{ url: "/og.png", width: 1730, height: 909, alt: "AD LMS — L’anglais professionnel en action" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AD LMS",
    description: "L’anglais professionnel en action.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}<ModuleHomeButton/><SpeechLifecycle/><SpeechCapture/></body></html>;
}
