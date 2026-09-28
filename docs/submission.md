# 제출 점검 기록

기준일: 2026-09-28. 제출 준비 작업 중이며 배포 결과 확인 후 이 기록을 갱신합니다.

| 요구사항 | 구현 근거 |
| --- | --- |
| Next App Router | src/app, next.config.ts |
| Tailwind CSS 4 | postcss.config.mjs, src/styles.css @theme |
| shadcn/ui | components.json, src/components/ui/Button·Card 및 실제 사용 |
| AI 컨텍스트 | AGENTS.md, CLAUDE.md |
| Figma MCP | docs/implementation.md의 13개 노드 대응표 |
| 역할별 섹션 | src/components/landing |
| 재사용 UI | Button·Card·Brand·BetaLink·Report |
| 사용자 인터랙션 | 같은 페이지 CTA, 녹음 토글, 폼, 권한 모달, 애니메이션 제어 |
| 반응형·접근성 | Playwright 320/390/768/1440, 포커스 복귀, reduced-motion |
| 메타데이터 | App Router Metadata, OG 이미지, canonical, robots, sitemap |
| GitHub·Vercel | 최종 배포 후 아래 기록 |

## 검증
- Next.js 프로덕션 정적 빌드·타입 검사 통과.
- Playwright 11개 시나리오 통과. 서체 최적화 후 반응형·메타데이터·CTA·애니메이션 3개 관련 시나리오 재검증 통과.
- 모바일·데스크톱 히어로, 기능 카드, 작성 화면 캡처 직접 확인.
- 로컬 검사 범위에서 이미지 누락·내부 앵커 오류·브라우저 콘솔 오류 없음.
- 현재 추적 파일에서 환경변수 비밀 파일 및 대표 비밀키 패턴 미검출. `.env*`, `.vercel/`, 빌드 결과 제외.
- npm 의존성 설치 감사: 알려진 취약점 0건.
- 음성 자동 테스트는 모의 브라우저 이벤트를 사용합니다. 실제 기기 음성 인식 품질·WebGPU 모델 다운로드는 별도 기기 확인 대상입니다.
- 결과물에 실제 사용자의 건강정보나 계정 비밀값을 포함하지 않습니다.

## 배포
GitHub: https://github.com/YelloWriter/carebrief
Vercel: 연결·배포 확인 중
공개/평가자 접근: 사용자 선택 확인 중

## Lighthouse 개선 전
로컬 프로덕션 빌드 기준: 모바일 성능 66 / 접근성 96 / 권장사항 100 / SEO 100, 데스크톱 99 / 96 / 100 / 100.
발견 사항: Google Fonts CSS 렌더링 지연, 푸터 작은 글씨 대비 부족, 헤더 로고 과대 해상도.
조치: 동일 서체 자체 호스팅, 푸터 색상 대비 강화, 기존 Figma 소형 로고 재사용. 최종 수치는 재검증 후 기록합니다.

## Lighthouse 개선 후
로컬 프로덕션 빌드(http://127.0.0.1:3000), Chrome headless, Lighthouse CLI 기본 모바일 시뮬레이션 기준:

| 환경 | 성능 | 접근성 | 권장사항 | SEO |
| --- | ---: | ---: | ---: | ---: |
| 모바일 | 94 | 100 | 100 | 100 |
| 데스크톱 | 95 | 100 | 100 | 100 |

로컬 측정이며 네트워크·CPU·측정 시점에 따라 점수는 달라집니다. 배포 성능을 보장하는 수치는 아닙니다. `npm run audit:lighthouse`로 재현하고 `.lighthouse/mobile.html`, `.lighthouse/desktop.html`을 확인합니다. 추가 최적화 후보는 기존 미사용 CSS와 JavaScript 축소입니다.
