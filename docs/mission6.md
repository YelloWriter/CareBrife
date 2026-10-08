# 미션 6: 진료 준비 템플릿 MVP

## 목적과 데이터 경계

누구나 재사용할 수 있는 **일반적인 진료 준비 항목·질문 템플릿** 한 종류를 등록·조회·수정·삭제합니다. 실제 환자의 이름·연락처·증상·복용약·처방전·검사 결과를 저장하지 않습니다. 실제 진료한장 작성 흐름은 기존처럼 브라우저 메모리에서만 동작하며 템플릿 DB로 보내지 않습니다.

이번 미션의 템플릿은 **누구나 조회·수정·삭제하는 공개 체험 데이터**입니다. 사용자 인증·소유권은 구현하지 않았습니다. 개인별 진료 기록 서비스가 아닙니다. 사용자별 RLS 정책과 인증은 미션 7의 별도 과제입니다.

## 기능 명세

| 화면/주소 | 입력·행동 | 성공 | 실패·대체 |
|---|---|---|---|
| 랜딩 `/#create-report` | 준비 템플릿 둘러보기 | `/templates/` 이동 | 기존 작성 도구 이용 가능 |
| 목록 `/templates/?page=1&q=...&category=...` | 제목 검색·분류·페이지 선택 | 최신순 6개, 전체 수, 이전/다음 | 조회 오류 재시도, 빈 목록·검색 결과 없음 안내 |
| 등록 `/templates/new/` | 제목·분류·설명·준비 항목·공개 예시 확인, 선택 이미지 | DB 저장 후 상세로 이동, 성공 안내 | 필드 오류, 입력 유지, 중복 제출 차단 |
| 상세 `/templates/[id]/` | 준비 항목·이미지 보기, 수정/삭제/목록/작성 도구 이동 | 새로고침 후 유지 | 잘못된 UUID·삭제된 ID 안내, 이미지 없음·불러오기 실패 |
| 수정 `/templates/[id]/edit/` | 기존 값 수정, 이미지 교체/삭제 | DB 반영 후 상세로 이동 | 다른 수정이 먼저 저장되면 409 충돌 안내 |
| 삭제 확인창 | 취소 또는 삭제 확인 | 레코드 삭제 후 목록, 이미지 정리 요청 | 충돌·연결 오류 표시, 재시도 |

제목 2~60자, 설명 5~200자, 준비 항목 5~2,000자, 이미지 설명 최대 120자(이미지가 있을 때 필수). 클라이언트와 서버에서 검증하며 DB에도 제약을 둡니다. 검색은 제목 부분 일치이며 `%`, `_`는 일반 문자로 처리합니다. 정렬은 생성 시각·UUID 내림차순으로 안정화합니다.

## 테이블 구조

### `public.preparation_templates`

| 컬럼 | 타입 | 필수/처리 |
|---|---|---|
| id | uuid PK | 필수, 생성 화면에서 UUID 발급, 중복 요청이 두 개의 행을 만들지 않음 |
| title | text | 필수, 2~60자 |
| category | text | 필수, 진료 전 준비 / 질문 정리 / 동행 체크 |
| summary | text | 필수, 5~200자 |
| checklist | text | 필수, 5~2,000자, 줄바꿈별 준비 항목 |
| image_path | text nullable | 서버가 생성한 Storage 경로, 사용자가 임의 URL을 제출하지 않음 |
| image_alt | text nullable | 이미지 설명 1~120자, 경로와 함께 존재 |
| version | integer | 필수, 기본 1, 수정 시 증가, 동시 수정·삭제 충돌 검출 |
| created_at | timestamptz | 필수, DB 생성 시각 |
| updated_at | timestamptz | 필수, DB 트리거가 수정 시 갱신 |

생성 시각과 UUID의 복합 인덱스를 사용합니다. 등록 상한 100개를 DB 잠금으로 검사하므로 동시 요청도 상한을 넘지 않습니다.

### `public.template_file_cleanup`

| 컬럼 | 타입 | 의미 |
|---|---|---|
| path | text PK | 정리할 Storage 객체 경로 |
| ready_at | timestamptz | 정리 가능한 시각; 업로드 후보는 1시간 뒤, 교체/삭제된 파일은 즉시 |

Storage와 DB는 하나의 트랜잭션으로 묶을 수 없으므로 파일 정리 대기열을 둡니다. 업로드 전에 후보를 기록하고 DB 저장 성공 시 같은 트랜잭션의 트리거로 후보를 제거합니다. 교체·삭제 시 기존 파일을 대기열에 추가합니다. 파일 삭제는 Next.js `after()`로 저장 응답 뒤에 실행합니다. 삭제에 실패하면 후속 쓰기 요청에서 최대 10개씩 묶어 재시도합니다. 유료 cron이나 별도 작업 서버는 사용하지 않습니다. 쓰기 요청이 없으면 대기 파일이 남을 수 있으므로 운영자가 Storage와 대기열을 점검할 수 있습니다.

## 데이터 접근과 파일

브라우저 → Next.js Route Handler → 서버 전용 Supabase client → PostgreSQL/Storage.

- `SUPABASE_SECRET_KEY`는 `server-only` 모듈에서만 사용합니다. 응답·로그·클라이언트 props·Git에 넣지 않습니다.
- RLS는 기본 차단 상태로 켜고 anon/authenticated의 테이블·함수 권한을 철회했습니다. 사용자별 정책은 아직 없습니다. 공개 접근은 검증을 수행하는 Next API를 통해서만 제공합니다. **Origin 검사는 로그인/소유권 보호가 아닙니다.** 공개 데모의 수정·삭제는 모두에게 허용됩니다.
- RLS enabled/no policy 2건은 서버 전용 접근 설계에 따른 INFO이며 공개 DB 권한을 주어 없애지 않습니다.
- Storage bucket `template-examples`는 private, 2MB, PNG/JPG/WebP만 허용합니다. API가 연결된 레코드의 파일만 제공합니다.
- 요청 본문도 실제 읽은 바이트로 제한합니다. MIME/파일 헤더 및 Sharp 디코딩을 확인하고 최대 1,600만 화소 이미지를 1,200px 이내 WebP로 변환합니다. 메타데이터를 제거합니다. 손상 파일·SVG·실행 파일을 받지 않습니다.
- 이미지가 없는 등록도 가능하며, 파일 실패 시 텍스트를 유지해 재시도할 수 있습니다.
- DB 핵심 데이터의 최종 저장소로 localStorage/Mock Data를 사용하지 않습니다.

## 무료 운영 범위

Supabase FREE의 전용 `carebrief-mvp` 프로젝트(서울)를 사용합니다. 프로젝트 생성 화면에서 FREE를 확인했습니다. 유료 업그레이드·카드 등록·유료 AI API·추가 유료 서비스는 사용하지 않습니다. 템플릿 100개·이미지 1개/2MB·실패한 업로드 대기 수 제한으로 사용량을 줄입니다. 이 제한이 모든 트래픽/사용량을 무제한 보장하는 것은 아니며 무료 제공량을 넘으면 제한·일시 중단될 수 있습니다. 요금제 업그레이드는 자동 진행하지 않습니다.

## 환경 및 재현

1. Node 22 LTS, `npm ci`.
2. 무료 Supabase 프로젝트를 만들고 `supabase/migrations`의 SQL을 순서대로 적용합니다. Supabase CLI 또는 대시보드 SQL Editor를 사용할 수 있습니다. 이미 적용한 프로젝트에 중복 적용하지 않습니다.
3. `.env.example`을 참고하여 `.env.local`에 `SUPABASE_URL`, `SUPABASE_SECRET_KEY` 설정. 실제 값은 Git에 올리지 않습니다.
4. `npm run dev`. 운영 빌드: `npm run typecheck && npm run build`, `npm run start`.
5. Vercel의 기존 `carebrief` 프로젝트 Production에 같은 이름의 환경 변수를 설정합니다. Secret key는 Secret 유형, 공개 접두사 없이 저장합니다. 별도 Supabase 프로젝트 없이 미리보기 배포에 운영 비밀키를 공유하지 않습니다.
6. GitHub main push → Vercel 자동 배포 → 아래 QA 실행.

**미션 6부터 Next 서버 실행이 필요하므로 정적 `output: export`를 사용하지 않습니다.** 기존 Firebase Hosting의 `carebrief.co.kr`은 미션 5 정적 배포를 유지합니다. 현재 빌드를 `out/`으로 간주해 Firebase에 배포하지 않습니다. 신규 템플릿은 제출용 Vercel URL에서 사용합니다. 기존 Firebase 배포 명령은 `docs/firebase-domain.md`의 과거 기록입니다.

## 검증 명령

```sh
npm run typecheck
npm run build
npm test
# 실제 연결된 공개 예시 DB에서만 실행. 합성 QA 행을 만들고 검사 뒤 삭제합니다.
RUN_LIVE_CRUD=1 npm test -- tests/templates.spec.ts
# 운영 환경에서도 동일 시나리오 실행
TEST_BASE_URL=https://carebrief-iota.vercel.app RUN_LIVE_CRUD=1 npm test -- tests/templates.spec.ts
```

DB 비밀키 없는 기본 CI는 유효성 검사·잘못된 주소·Origin 차단과 기존 진료한장 회귀 검사를 수행합니다. 실제 DB 검사는 명시적으로 켜서 실행합니다. 업로드 실패 화면의 네트워크 모의 응답 검사는 실제 Supabase 장애를 증명하지 않습니다. 실제 CRUD 결과는 별도 QA 결과에 기록합니다.

## QA 결과 (2026-10-08)

- [x] TypeScript 검사 및 Next 서버 빌드
- [x] 신규 DB 테이블/Storage 생성, anon 직접 접근 차단 확인
- [x] 빈 값·잘못된 파일 형식·잘못된 요청 제출
- [x] 실제 등록 → 목록·상세 → 새로고침 유지
- [x] 실제 수정 → 이미지 삭제 → 삭제 확인/취소 → 목록 반영
- [x] 다른 수정과의 충돌(409)
- [x] 검색·6개 페이지네이션·빈 결과
- [x] 없는 상세 주소와 이미지 없는 상태
- [x] 저장 실패 입력 유지(모의 네트워크 실패)
- [x] 모바일·데스크톱 화면 직접 확인
- [x] Vercel 운영 환경 전체 CRUD와 파일 업로드

배포 URL: https://carebrief-iota.vercel.app/templates/

운영 최종 검증: 코드 `7498a86`의 Vercel 배포에서 전체 30개 검사 중 **29개 통과, 실제 음성 파일을 사용하는 선택 검사 1개 생략**. 실제 Supabase 등록·새로고침·목록·상세·수정·이미지 업로드/삭제·삭제 확인, 검색·페이지네이션을 확인했습니다. 테스트 후 DB는 공개 예시 3개, 연결 이미지 3개, QA 레코드 0개, 파일 정리 대기 0개였습니다. 새 익명 브라우저 세션에서 목록·상세·등록을 열어 콘솔 오류 0개와 390/1440px 캡처를 확인했습니다. 모바일 검증은 브라우저 화면 크기 기준이며 실제 휴대폰 마이크 검증은 포함하지 않습니다.

[GitHub 자동 검사 통과](https://github.com/YelloWriter/CareBrife/actions/runs/37743477209) · [Vercel 검증 배포](https://vercel.com/tom-f7d5/carebrief/CoP2WRZdmLuoehj6Dwww3gtVscC6). 제출 저장소는 Public, Vercel은 Hobby, Supabase는 Free를 유지했습니다. 두 GitHub 저장소에 최신 코드를 반영했으며 Firebase 기존 도메인의 정적 버전은 변경하지 않았습니다.

로컬 검증: 기존 진료한장 회귀 23개 통과, 실제 음성 파일을 사용하는 선택 검사 1개 생략. 신규 템플릿 6개 검사 통과(실제 Supabase CRUD·이미지 처리 포함, 1개는 모의 저장 오류 검사). 신규 검사는 중복 UUID 409, 오래된 version 409, 서버 필수값 400, 초과 본문 413, 잘못된 파일 400도 확인했습니다. QA 후 테스트 레코드·Storage 객체·정리 대기열 0개 확인 후, 개인정보 없는 공개 예시 3개와 기존 자체 생성 일러스트를 등록했습니다.

모바일 320·390, 태블릿 768, 데스크톱 1440px 가로 넘침 검사와 390/1440px 화면 캡처를 확인했습니다. [목록 데스크톱](screenshots/templates-desktop.png), [목록 모바일](screenshots/templates-mobile.png), [상세 모바일](screenshots/templates-detail-mobile.png), [입력 모바일](screenshots/templates-form-mobile.png).

Next.js를 16.4.0으로 보안 패치했고 더 이상 쓰지 않는 정적 서버 의존성을 제거했습니다. `npm audit` 취약점 0개 확인. Supabase 보안 검사: ERROR/WARN 없음, 의도적인 기본 차단 RLS/no-policy INFO 2건([설명](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)).

운영 확인 중 미국 기본 실행 리전과 서울 DB 간 왕복 및 동기 파일 정리로 완료 안내가 늦어지는 현상을 발견했습니다. Vercel 단일 실행 리전을 서울(`icn1`)로 맞추고 파일 정리를 응답 후 `after()`에서 배치 처리하도록 보완했습니다. 추가 리전이나 유료 작업 서비스는 사용하지 않습니다.

삭제 버전은 `X-Template-Version` 헤더로 전송합니다. HTTP 표준 `If-Match`는 Vercel의 조건부 응답 처리(412)와 충돌하므로 사용하지 않습니다. DB의 version 조건 검사는 그대로 유지합니다.
