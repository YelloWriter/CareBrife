# 공통 UI와 디자인 규칙

Tailwind CSS 4의 PostCSS 플러그인을 사용합니다. `src/styles.css`의 theme/utilities를 로드하고 기존 reset은 보존합니다. 설치만 한 상태가 아니라 공통 Button·Card의 크기, 레이아웃, 상태, 포커스, 간격에 Tailwind 유틸리티를 사용합니다.

shadcn/ui New York Radix 레지스트리의 Button·Card를 로컬 소스로 가져왔습니다. `cn`은 clsx와 tailwind-merge를 사용하고 Button은 Radix Slot으로 링크를 지원합니다. 출처:
- https://ui.shadcn.com/r/styles/new-york-v4/button.json
- https://ui.shadcn.com/r/styles/new-york-v4/card.json
- https://ui.shadcn.com/docs/installation/manual

브랜드 조정: 터치 높이 44px 이상, 한글 줄바꿈, 54px 작성 버튼(flow), 랜딩 CTA(landing), 네이비·시안·종이색 테마. 공통 버튼을 히어로 CTA·베타 링크·작성 흐름에 사용하고 Card를 기능 소개에서 재사용합니다. 데이터 처리나 디자인 전용 애니메이션은 기존 컴포넌트 CSS를 유지합니다.

랜딩 컴포넌트: HeroSection, EmpathySection, MethodsSection, FeaturesSection, HowItWorksSection, PrivacySection, CreateReportSection, BetaFitSection, BetaProcessSection, CTASection, FAQSection. 각 컴포넌트는 해당 섹션의 DOM을 소유하며 App은 언어·스크롤 효과와 섹션 구성을 담당합니다.

서체는 Fontsource의 Noto Sans KR Variable·Gowun Dodum을 자체 제공하여 외부 Google Fonts CSS 요청을 제거합니다. 라이선스는 각 npm 패키지의 OFL을 따릅니다.

로컬 Turbopack의 PostCSS 프로세스 포트 제약을 피하기 위해 Next.js 공식 `--webpack` 빌드·개발 옵션을 사용합니다. 결과는 동일한 App Router 정적 export입니다.
