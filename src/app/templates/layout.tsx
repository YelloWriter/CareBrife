import Link from "next/link";
import type { Metadata } from "next";
import "./templates.css";
export const metadata: Metadata = {
  title: "진료 준비 템플릿 | 진료한장",
  description:
    "진료 전 준비 항목과 질문 예시를 함께 만드는 공개 체험 공간입니다.",
  robots: { index: false, follow: true },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="templates-shell">
      <a className="template-skip" href="#template-main">
        본문으로 이동
      </a>
      <header className="template-header">
        <Link href="/" aria-label="진료한장 홈">
          <img
            src="/figma/logo-small.webp"
            width="136"
            height="44"
            alt="진료한장"
          />
        </Link>
        <nav aria-label="템플릿 메뉴">
          <Link href="/templates/">준비 템플릿</Link>
          <Link href="/#create-report">진료한장 만들기</Link>
        </nav>
      </header>
      <main id="template-main" className="template-main">
        {children}
      </main>
      <footer className="template-footer">
        진료한장 · 진료 전에, 함께 준비하는 한 장<br />
        공개 템플릿은 진단이나 처방을 제공하지 않습니다.
      </footer>
    </div>
  );
}
