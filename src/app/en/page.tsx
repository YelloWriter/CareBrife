import type { Metadata } from "next";
import App from "../../App";
import { pageMetadata } from "@/i18n";
export const metadata: Metadata = {
  ...pageMetadata.en,
  alternates: { canonical: "/en/", languages: { ko: "/", en: "/en/" } },
  openGraph: { ...pageMetadata.en, locale: "en_US", type: "website", images: [{ url: "/og.png", alt: "Carebrief — one caring page" }] },
};
export default function Page() { return <App initialLanguage="en" />; }
