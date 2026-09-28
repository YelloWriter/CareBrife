import type { Metadata, Viewport } from "next";
import "../styles.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://carebrief-co-kr.web.app"),
  title: "진료한장 | 부모님의 진료를 준비하는 가장 다정한 한 장",
  description: "증상, 복용약, 최근 변화와 궁금한 점을 병원에서 보여줄 한 장으로 정리해요.",
  icons: { icon: "/jinryo-hanjang-symbol-cropped.png" },
  openGraph: { title: "진료한장", description: "부모님의 진료를 준비하는 가장 다정한 한 장", images: ["/og.png"], type: "website" },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};
export const viewport: Viewport = { themeColor: "#f8f7f3" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
