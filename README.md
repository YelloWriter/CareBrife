# 진료한장

증상·복용약·최근 변화·질문을 진료 전에 정리하는 웹사이트입니다. 진단이나 처방을 제공하지 않습니다.

[공개 GitHub 저장소](https://github.com/YelloWriter/CareBrife) · [사이트 바로 보기](https://carebrief-iota.vercel.app) · [모바일 화면](docs/screenshots/mobile.png) · [데스크톱 화면](docs/screenshots/desktop.png)

## 기술 및 실행

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4, shadcn/ui (Radix Button·Card), lucide-react
- Playwright 사용자 흐름 검증, Lighthouse 품질 점검
- Next.js 서버 렌더링·Route Handlers → GitHub 연동 Vercel 배포
- Supabase PostgreSQL·Storage: 공개 진료 준비 템플릿 CRUD
- 유료 AI API 없음. 실제 진료 내용은 기존처럼 브라우저 메모리에서만 처리

Node.js 22 LTS와 npm을 권장합니다(최소 Node.js 20.9).

```sh
git clone https://github.com/YelloWriter/CareBrife.git
cd CareBrife
npm ci
npm run dev
```

`http://localhost:3000`에서 확인합니다. 프로덕션 빌드를 확인하려면 개발 서버를 종료한 뒤:

```sh
npm run typecheck
npm run build
npm run preview
```

경로는 `/`(한국어 랜딩), `/en/`(영어 랜딩), `/create/`(새 한국어 작성 흐름)입니다. 랜딩의 ‘진료한장 만들어보기’ 버튼은 같은 페이지의 `#create-report` 섹션으로 부드럽게 스크롤합니다. 작성·수정·완료는 그 섹션 안에서 진행되고 다른 랜딩 섹션을 보아도 입력은 유지됩니다. `/create/`는 작성 화면의 직접 접근 주소로도 유지합니다.

`NEXT_PUBLIC_SITE_URL`을 설정하면 소셜 미리보기의 기준 URL을 변경할 수 있습니다. Vercel에서는 제공되는 운영 도메인을 자동으로 사용하고, 로컬에서는 `http://localhost:3000`을 사용합니다. `.env.example`을 참고하세요. 템플릿에는 서버 전용 `SUPABASE_URL`, `SUPABASE_SECRET_KEY`가 필요합니다. `.env.local`과 Vercel Production 환경변수로만 설정하며 GitHub에는 실제 값을 올리지 않습니다.

## 미션 6: 공개 진료 준비 템플릿

[템플릿 바로 가기](https://carebrief-iota.vercel.app/templates/) · [기능 명세·테이블 구조·파일 처리·QA 결과](docs/mission6.md)

- 목록(`/templates/`) → 상세(`/templates/[id]/`) → 등록(`/templates/new/`)·수정(`/templates/[id]/edit/`) → 삭제 확인의 한 사이클.
- 실제 Supabase DB 저장, 6개씩 페이지네이션, URL 제목 검색·분류, 로딩·오류·빈 상태·없는 주소 처리.
- 이미지 1개(선택, PNG/JPG/WebP 2MB 이하) 업로드·미리보기·교체·삭제. Storage의 private bucket에 저장하고 상세에서 확인.
- 중복 제출 방지, 서버/클라이언트/DB 검증, 수정 충돌 검사. 이미지 정리 실패는 DB 대기열에 남겨 재시도.
- **로그인 없는 공개 예시 공간**: 누구나 조회·수정·삭제합니다. 실제 개인정보·건강정보는 저장하지 않습니다. 기존 진료 내용과 템플릿 데이터는 분리합니다.
- Supabase Free를 유지하며 유료 업그레이드는 하지 않습니다. 등록 상한 100개, 이미지 크기 제한을 적용합니다.

테이블: `preparation_templates` — UUID, 제목, 분류, 설명, 줄별 준비 항목, 선택 이미지 경로/설명, 버전, 생성/수정 시각. `template_file_cleanup` — 이미지 정리 대기 경로와 처리 시각. 상세 타입·필수값과 접근 규칙은 [미션 6 명세](docs/mission6.md)에 있습니다.

2026-10-08 운영 배포 QA: **29개 통과, 실제 음성 파일을 사용하는 선택 검사 1개 생략**. 실제 Supabase CRUD·파일 업로드·새로고침 유지·검색·페이지네이션, 모바일/데스크톱 화면을 확인했습니다. 공개 예시 3개를 제공하며 테스트 데이터는 정리했습니다. 재현 방법과 검증 범위는 [미션 6 QA](docs/mission6.md#qa-결과-2026-10-08)를 참고하세요.

## 새 작성 흐름

Figma의 390px 디자인 13개를 반응형으로 구현했습니다. 큰 화면에서는 작성 화면을 가운데 배치합니다.

시작 → 말/글 입력 → 정리 → 확인·수정 → 완료 → 크게 보기 / PDF 저장

받아쓰기·정리·PDF 오류에는 재시도와 대체 경로가 있습니다. 직접 작성은 AI 없이도 완료할 수 있습니다. 입력은 새로고침 시 복구되지 않으며, 나가기 버튼은 내용 삭제를 확인합니다. 탭 닫기·새로고침에는 브라우저 기본 경고가 사용됩니다.

### 자동 정리

WebGPU 지원 기기에서는 기존 WebLLM 공개 모델을 기기에 내려받아 문장을 분류합니다. AI는 문장 번호만 반환하며 원문을 새로 작성하지 않습니다. 모든 문장이 중복 없이 포함됐는지 검사하므로 모델이 병명·날짜·약 정보를 추가하거나 원문을 누락한 결과는 채택하지 않습니다.

WebGPU 미지원 기기에서는 원문 문장을 규칙으로 나누고, 확인 화면에 그 사실을 표시합니다. AI 오류·응답 검증 실패·90초 시간 초과 시에도 원문을 규칙으로 나눠 바로 확인·수정 화면으로 이어집니다. 처음 모델을 내려받는 기기는 다운로드가 오래 걸릴 수 있습니다. 처리 중에도 직접 작성으로 전환할 수 있습니다.

### 음성

같은 마이크 버튼을 한 번 누르면 시작하고 다시 누르면 종료합니다(길게 누르기 아님). 한국어 입력, 경과 시간, 5분 자동 종료, 권한 안내를 지원합니다.

- 기본: 브라우저 SpeechRecognition을 사용합니다. 브라우저 제공업체의 음성 서비스에서 처리될 수 있습니다. 종료 전에 받은 임시 인식 결과도 보존합니다.
- 연결 실패(`network`, `service-not-allowed`) 또는 API 미지원: MediaRecorder로 **새 녹음을 시작**하고 기기 내 모드임을 안내합니다. 이 안내가 뜬 뒤 다시 말하면 됩니다. 다음 녹음부터는 바로 기기 내 모드를 사용합니다.
- 기기 내 모드: 녹음 Blob은 메모리에만 두고 16kHz로 변환한 뒤 Web Worker의 Transformers.js + 다국어 Whisper tiny(q8/WASM)로 한국어를 받아씁니다. 음성은 서버로 전송하거나 파일·스토리지에 보관하지 않습니다. 최초 모델·WASM 다운로드에는 인터넷과 시간이 필요하며 모델 파일만 캐시합니다.
- 받아쓴 글은 원문 기준으로 나눠 바로 확인·수정하도록 표시합니다. 소리가 없는 녹음은 모델에 보내지 않습니다. 녹음 중단·페이지 이탈 시 마이크 트랙을 닫고, 변환 취소·3분 시간 초과 시 worker를 종료합니다.

음성 인식은 오인식할 수 있으므로 날짜·약 이름·증상을 반드시 확인하고 수정해야 합니다. 권한을 거부하면 기기 내 모드도 사용할 수 없으며 글 입력으로 계속할 수 있습니다.

### PDF

‘PDF 저장하기’는 pdf-lib로 **실제 PDF 파일을 생성해 다운로드**합니다. 인쇄 창 지원 여부에 의존하지 않습니다. 한국어 Noto Sans KR 글꼴을 포함하며, A4 크기에 원문·작성일·페이지 번호를 배치합니다. 긴 내용은 잘라내지 않고 다음 페이지로 이어집니다.

문서는 브라우저 메모리 안에서 만들고 서버에 전송하지 않습니다. 파일 생성 중 중복 요청을 막고, 생성 후 ‘PDF 파일 다시 받기’와 ‘PDF 열기’ 링크를 남깁니다. 앱은 기기에 파일이 저장됐는지 확인할 수 없으므로 파일을 준비했다고만 표시합니다. 내용 수정·이탈 시 임시 Blob URL을 해제하며 생성 중 나가면 요청을 취소합니다. 글꼴·이미지 로딩 실패 시 내용은 그대로 유지하고 다시 저장할 수 있습니다. PDF 글꼴이 지원하지 않는 문자는 임의로 누락하지 않고 수정 안내를 표시합니다.

글꼴: [Google Fonts Noto Sans KR](https://github.com/google/fonts/tree/main/ofl/notosanskr)의 가변 TTF를 fontTools로 weight 400에 고정했습니다. `public/fonts/OFL-NotoSansKR.txt`에 SIL Open Font License를 포함합니다. 글꼴과 PDF 라이브러리는 저장 요청 시 로드합니다. 브라우저의 일반 인쇄를 위한 CSS도 유지합니다.

## 검증

```sh
npx playwright install chromium
npm run build
npm test
```

기존 Chromium을 사용하려면 `PLAYWRIGHT_CHROMIUM_EXECUTABLE`에 실행 파일의 절대 경로를 지정합니다. 테스트는 Next.js 운영 서버를 시작하거나 실행 중인 3000번 포트 서버를 사용합니다. `TEST_BASE_URL`로 배포 URL을 지정하면 로컬 서버 없이 해당 배포를 검사합니다.

테스트 범위: 랜딩 CTA, 글 입력·수정·완료·읽기, 빈 입력 차단, 원문 보존과 모델 결과 검증, 음성 미지원 대체, 모의 음성 이벤트와 5분 종료, 처리 시간 초과 복구, PDF 오류, 나가기 대화상자, 뒤로 가기, 모바일/데스크톱 넘침, 영어 랜딩, 실제 PDF 다운로드·한글 및 페이지 나눔·재시도·생성 취소. 실제 마이크 인식 품질과 실제 기기의 WebGPU 모델 다운로드·추론은 별도 기기 확인이 필요합니다.

음성 회귀 검사에는 서비스 연결 실패→기기 내 녹음→확인·완료, 마이크 해제, worker 취소, 권한 거부, 무음 차단이 포함됩니다. `LOCAL_ASR_FIXTURE=/absolute/path/synthetic-korean.wav npm test -- tests/local-speech.spec.ts`로 실제 WASM 모델까지 검증합니다. 해당 선택 검사는 **합성 한국어 음성 파일**을 사용하고 모델을 다운로드하므로 기본 CI에서는 생략합니다. 사용자 음성·건강정보를 테스트 파일로 저장하지 않습니다.

디자인 대응표와 검증 기록: [docs/implementation.md](docs/implementation.md).

## 배포

- GitHub: https://github.com/YelloWriter/CareBrife
- Vercel 배포 URL: **https://carebrief-iota.vercel.app**
- Framework Preset: Next.js / Root Directory: 저장소 루트 / Build: `npm run build`
- Output Directory: Vercel 기본 자동 감지. 정적 export가 아닌 Next.js 서버를 사용합니다.
- 필수 환경변수: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`(서버 전용). 선택: `NEXT_PUBLIC_SITE_URL`.

Vercel에서 위 GitHub 저장소를 Import하고 운영 브랜치를 `main`으로 지정합니다. 이후 GitHub의 `main` 변경이 자동으로 운영에 배포됩니다. 다른 브랜치는 미리보기 배포에 사용합니다. 제출 저장소는 **Public**이며 별도 GitHub 초대 없이 열람할 수 있습니다.

기존 커스텀 도메인 **https://carebrief.co.kr**은 Firebase Hosting의 미션 5 정적 버전입니다. 미션 6의 CRUD는 서버가 필요한 Vercel에서 제공합니다. 현재 코드를 정적 `out/`으로 Firebase에 배포하지 마세요. [기존 도메인 배포 기록](docs/firebase-domain.md)은 과거 정적 버전의 기록입니다.

베타 신청 링크는 기존 `src/components/landing/shared.tsx`의 `BETA_FORM_URL`을 사용합니다. 진료한장 작성 도구의 입력 내용은 React 메모리에만 있으며 localStorage, sessionStorage, 서버 로그 또는 DB에 기록하지 않습니다. 다운로드된 모델 자산은 WebLLM이 브라우저에 캐시할 수 있습니다.

## 이용 방법 일러스트

네 단계의 그림은 내장 imagegen 도구로 생성한 투명 배경 이미지입니다. `public/illustrations/`의 WebP 자산을 사용하며, 말하기 파형·확인 체크·문서 모으기·리포트 전달을 각각 다른 CSS 애니메이션으로 표현합니다. 화면 밖에서는 멈추며 사용자가 일시 정지하거나 기기의 동작 줄이기 설정을 적용할 수 있습니다. 원본 생성 프롬프트와 자산 경로는 [docs/illustrations.md](docs/illustrations.md)에 있습니다.

## AI 작업 맥락과 제출 기록

- [AGENTS.md](AGENTS.md): 목적·기술·디자인·개인정보 경계·작업 및 검증 규칙
- [CLAUDE.md](CLAUDE.md): Claude 시작점
- [docs/ui-system.md](docs/ui-system.md): Tailwind·shadcn 출처와 재사용 구조
- [docs/implementation.md](docs/implementation.md): Figma 13개 화면 대응·원본과의 차이 및 보정
- [docs/submission.md](docs/submission.md): 제출 체크리스트·검증 결과·배포 증적

언어 전환은 `/`와 `/en/` 사이를 이동합니다. 작성 중이라면 브라우저의 나가기 경고가 표시되며, 실제로 이동하면 메모리의 초안이 사라집니다.

Lighthouse: `npm run audit:lighthouse` (먼저 빌드·미리보기 실행). 결과는 `.lighthouse/`에 저장합니다. `AUDIT_URL`로 배포 URL도 검사할 수 있습니다.

## 구현한 인터랙션과 모션

- **페이지 안 CTA 이동:** 헤더와 히어로에서 작성 섹션으로 부드럽게 이동하고 작성 중 초안을 유지합니다.
- **스크롤 등장:** 섹션 제목과 카드를 18px 올리며 나타내고, 같은 그룹은 60ms 간격으로 차례로 표시합니다. 한 번 보인 콘텐츠는 다시 숨기지 않습니다.
- **접근성:** 키보드로 포커스한 콘텐츠는 즉시 표시하고, OS의 `prefers-reduced-motion` 변경도 실시간으로 반영합니다. JavaScript가 꺼져도 랜딩 정보는 보입니다.
- **네 단계 일러스트:** 말하기·확인·정리·진료실 전달 모션, 화면 밖 정지 및 사용자의 일시 정지.
- **작성 도구:** 녹음 시작/종료 토글, 글 입력, 내용 수정, 권한 안내 모달, 크게 보기, PDF 다운로드·재시도, 나가기 확인.
- **FAQ와 언어 전환:** 키보드로 펼칠 수 있는 질문 목록, 한국어/영어 랜딩.

최신 Lighthouse 측정 조건·점수·개선 내용은 [품질 점검 기록](docs/lighthouse.md)에 있습니다. 점수는 실험실 측정값이며 실제 사용자 환경에 따라 달라집니다. `AUDIT_URL=https://carebrief-iota.vercel.app AUDIT_OUTPUT_DIR=.lighthouse/production npm run audit:lighthouse`로 재측정할 수 있습니다. 브라우저를 자동으로 찾지 못하면 `PLAYWRIGHT_CHROMIUM_EXECUTABLE`에 Chrome 실행 파일 경로를 지정하세요.

2026-09-28 운영 사이트 Lighthouse 3회 측정 중앙값: **모바일 성능 97(94–99), 데스크톱 성능 100**, 접근성·권장사항·SEO는 두 환경 모두 **100**입니다. 자세한 수치와 남은 최적화 후보는 위 품질 점검 기록에서 확인할 수 있습니다.
