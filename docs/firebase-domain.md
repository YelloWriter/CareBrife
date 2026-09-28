# 기존 도메인 배포 — 2026-09-28

- 실제 기존 주소: https://carebrief.co.kr (`carebrife.co.kr`은 이번 확인 시 DNS 레코드가 없었습니다).
- Firebase 프로젝트 및 Hosting 사이트: `carebrief-co-kr`, 기본 주소 https://carebrief-co-kr.web.app.
- 기존 저장소: https://github.com/YelloWriter/carebrief. 제출 저장소: https://github.com/YelloWriter/CareBrife.
- 이전 사이트는 2026-07-30 배포된 Vite 빌드였습니다. 두 저장소를 최신 코드로 동기화하고 Next.js 정적 내보내기 394개 파일을 Firebase Hosting에 배포했습니다.
- 앱 코드 기준 `c0f8b3d884ac46f387a6c592089ce0e4dfb6a42f`. `NEXT_PUBLIC_SITE_URL=https://carebrief.co.kr`로 빌드해 canonical·OG·sitemap 주소를 맞췄습니다.

## 검증

- 실제 도메인의 `/`, `/en/`, `/create/`, robots, sitemap, PDF 한글 글꼴 HTTP 200 확인.
- 실제 도메인 대상 익명 Playwright 전체 검사 23개 통과 / 실제 음성 모델 선택 검사 1개 생략(45.5초).
- 모바일·데스크톱 CTA, 같은 페이지 작성, 수정·완료, 음성 오류 대체, 모션·키보드, PDF 실제 다운로드·재시도, 이미지·메타데이터·콘솔 검사 포함.
- 기존 HTML 전용 캐시 규칙은 `/`, `/en/`, `/create/`에 적용되지 않아 실제 응답이 1시간 캐시였습니다. 전체 기본 응답은 `no-cache`로 재검증하고 `/_next/static/`의 해시 자산은 1년 immutable로 처리하도록 보완했습니다.
- 최종 배포 후 세 페이지와 PDF 글꼴의 `no-cache`, 실제 Next.js 해시 청크의 `public,max-age=31536000,immutable` 응답을 확인했습니다.

## 다음 배포

기존 저장소 push와 Firebase Hosting 배포는 별개입니다. 자동 배포용 서비스 계정·비밀키를 새로 만들지 않았습니다. 로그인된 공식 CLI에서 아래 명령을 실행합니다.

```sh
npm ci
NEXT_PUBLIC_SITE_URL=https://carebrief.co.kr npm run build
npx firebase-tools@15.31.0 deploy --only hosting --project carebrief-co-kr
```

배포 범위는 Hosting뿐이며 Firebase 데이터베이스·인증·결제 설정 및 DNS는 변경하지 않았습니다. 기존 브라우저 캐시가 남으면 새로고침으로 새 버전을 확인합니다.

설정 근거: [Firebase Hosting 배포](https://firebase.google.com/docs/hosting/quickstart), [헤더 적용 규칙](https://firebase.google.com/docs/hosting/full-config#headers).
