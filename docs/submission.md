# 제출 점검 기록

**최신 제출 링크:** [공개 GitHub](https://github.com/YelloWriter/CareBrife) · [운영 사이트](https://carebrief-iota.vercel.app) · [최종 Lighthouse 3회 기록](lighthouse.md#최종-운영-측정--3회).

기준일: 2026-09-28. Next.js 전환·제출 보완을 기본 브랜치에 반영하고 실제 Vercel 운영 사이트를 검증했습니다.

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
| GitHub·Vercel | 운영 배포·검증 근거는 아래 기록 |

## 최초 전환 검증(이전 기록)
- Next.js 프로덕션 정적 빌드·타입 검사 통과.
- Playwright 11개 시나리오 통과. 서체 최적화 후 반응형·메타데이터·CTA·애니메이션 3개 관련 시나리오 재검증 통과.
- 모바일·데스크톱 히어로, 기능 카드, 작성 화면 캡처 직접 확인.
- 로컬 검사 범위에서 이미지 누락·내부 앵커 오류·브라우저 콘솔 오류 없음.
- 현재 추적 파일에서 환경변수 비밀 파일 및 대표 비밀키 패턴 미검출. `.env*`, `.vercel/`, 빌드 결과 제외.
- npm 의존성 설치 감사: 알려진 취약점 0건.
- 음성 자동 테스트는 모의 브라우저 이벤트를 사용합니다. 실제 기기 음성 인식 품질·WebGPU 모델 다운로드는 별도 기기 확인 대상입니다.
- 결과물에 실제 사용자의 건강정보나 계정 비밀값을 포함하지 않습니다.

## 배포
GitHub: https://github.com/YelloWriter/CareBrife
Vercel: https://carebrief-iota.vercel.app
Vercel 사이트: 로그인 없이 접근 확인. 제출 GitHub 저장소 `YelloWriter/CareBrife`: Public, 평가자 초대 없이 열람 가능.

2026-09-28 최신 품질 개선과 운영 사이트 Lighthouse 기록: [lighthouse.md](lighthouse.md). 아래의 최초 전환 기록은 이전 저장소에서 수행한 이력입니다.

## 최초 전환 당시 Lighthouse 개선 전
로컬 프로덕션 빌드 기준: 모바일 성능 66 / 접근성 96 / 권장사항 100 / SEO 100, 데스크톱 99 / 96 / 100 / 100.
발견 사항: Google Fonts CSS 렌더링 지연, 푸터 작은 글씨 대비 부족, 헤더 로고 과대 해상도.
조치: 동일 서체 자체 호스팅, 푸터 색상 대비 강화, 기존 Figma 소형 로고 재사용. 최종 수치는 재검증 후 기록합니다.

## 최초 전환 당시 Lighthouse 개선 후
로컬 프로덕션 빌드(http://127.0.0.1:3000), Chrome headless, Lighthouse CLI 기본 모바일 시뮬레이션 기준:

| 환경 | 성능 | 접근성 | 권장사항 | SEO |
| --- | ---: | ---: | ---: | ---: |
| 모바일 | 94 | 100 | 100 | 100 |
| 데스크톱 | 95 | 100 | 100 | 100 |

로컬 측정이며 네트워크·CPU·측정 시점에 따라 점수는 달라집니다. 배포 성능을 보장하는 수치는 아닙니다. `npm run audit:lighthouse`로 재현하고 `.lighthouse/mobile.html`, `.lighthouse/desktop.html`을 확인합니다. 추가 최적화 후보는 기존 미사용 CSS와 JavaScript 축소입니다.

## 실제 배포 검증
- PR #1 병합: `b26d1dcc8cea59a8a69c5868f7864e3d530194d8`.
- GitHub Actions: https://github.com/YelloWriter/carebrief/actions/runs/36381996938 — 설치·타입·빌드·11개 테스트 성공.
- Vercel 최초 운영 배포: https://vercel.com/tom-f7d5/carebrief/J8Lr2eEcTM2jvAyDfpLoa5ACedjc — Ready, main 소스 확인.
- 독립 브라우저 컨텍스트(로그인·기존 쿠키 없음)로 실제 운영 URL의 Playwright 11개 시나리오 전부 통과.
- 같은 페이지 CTA, 입력·수정·완료·크게 보기·인쇄·오류 복구·권한 모달, 320/390/768/1440px 가로 넘침, 이미지와 콘솔 검사.
- `/`, `/en/`, `/create/`, `robots.txt`, `sitemap.xml` 접근 확인. OG 이미지와 canonical은 실제 운영 도메인을 가리킵니다.
- 외부 베타 신청 링크 HTTP 200 확인(신청 제출은 하지 않음).
- 실제 배포 화면: [모바일](screenshots/mobile.png), [데스크톱](screenshots/desktop.png).

## 자동 재배포 확인 방법
이 README·검증 기록을 main에 push한 커밋의 Vercel 상태와 아래 Deployments의 소스 SHA를 대조합니다. 운영 URL은 동일하게 유지됩니다. 수동 zip 업로드나 CLI 배포를 사용하지 않습니다.
https://vercel.com/tom-f7d5/carebrief/deployments?environment=production

검증 명령: `TEST_BASE_URL=https://carebrief-iota.vercel.app npm test`.

## 공개 제출 저장소 연결

- 제출 저장소: https://github.com/YelloWriter/CareBrife — Public, 기본 브랜치 `main`.
- 2026-09-28 기존 Vercel 프로젝트의 Git 연결을 `YelloWriter/CareBrife`로 변경. 도메인 `https://carebrief-iota.vercel.app` 유지.
- 코드 이력을 보존해 업로드했으며, 19개 기존 커밋의 158개 고유 파일에서 대표적인 비밀키 패턴이 검출되지 않았습니다. 패턴 검사는 완전한 보안 감사를 의미하지 않습니다.
- 로컬 타입 검사·프로덕션 빌드 통과. 회귀 시나리오 23개 확인, 외부 모델을 내려받는 실제 음성 선택 검사 1개는 생략. 새 모션 테스트는 데스크톱 메뉴 크기를 명시해 2개 재검사 통과.
- 모바일 390px·데스크톱 1440px 화면을 직접 확인했고, 기존 320~1440px 가로 넘침 검사도 통과했습니다.

## 최종 운영 검증

- 최종 코드: `4227ec9a5eee524b4fe6d360e106940c460a0513`.
- GitHub Actions 전체 검사 성공: https://github.com/YelloWriter/CareBrife/actions/runs/36388554589
- 새 저장소 push로 생성된 운영 배포 성공: https://vercel.com/tom-f7d5/carebrief/HWqkSTEgBf2m5x5N7pQvctdeSSd5
- 운영 URL 대상 익명 Playwright 전체 검사 **23개 통과 / 실제 음성 모델 선택 검사 1개 생략**(29.2초). 모바일·데스크톱 CTA, 같은 페이지 작성, 음성 대체, 모션·키보드·동작 줄이기, PDF 실제 다운로드·재시도, 이미지·메타데이터·콘솔 검사 포함.
- 최종 Lighthouse 3회 중앙값: 모바일 성능 97(94–99), 데스크톱 성능 100. 접근성·권장사항·SEO 각각 100. 원본 측정 요약: `docs/lighthouse-after.json`.
- 현재 제출 저장소의 main 업로드 → Vercel 자동 배포 → 동일 운영 URL 검증 흐름을 확인했습니다.
