# 진료한장

부모님과 따로 사는 자녀가 부모님의 증상, 복용약, 최근 변화와 의료진께 묻고 싶은 내용을 정리하고 **A4 한 장 리포트**로 미리 확인하는 검증용 정적 웹사이트입니다.

핵심 카피는 “부모님의 진료를 준비하는 가장 다정한 한 장, 진료한장”입니다. 이 서비스는 진단·처방 서비스가 아니라 **진료 전 정보 정리 서비스**입니다.

## 주요 기능

- 모바일 우선 랜딩페이지와 데스크톱 2단 입력·미리보기 화면
- 증상, 진료 이력, 복용약, 질문, 가져갈 자료 입력
- 같은 시기의 사건을 한 행으로 묶는 진료 타임라인
- 빈 항목을 자동으로 제외하는 A4 한 장 리포트
- 의료진께 확인할 질문 최대 3개 표시
- 브라우저 인쇄 기능을 이용한 인쇄 및 PDF 저장
- 사용자 입력을 서버로 전송하거나 저장하지 않는 브라우저 상태 기반 구조

## 기술 구성

- Vite
- React
- TypeScript
- Firebase Hosting

별도 서버, 데이터베이스, 파일 저장소 또는 유료 API를 사용하지 않습니다.

## 로컬 실행

Node.js가 설치된 환경에서 다음 순서로 실행합니다.

```bash
npm install
npm run dev
```

화면에 표시되는 로컬 주소를 브라우저에서 열어 확인합니다.

## 타입 확인과 빌드

```bash
npm run typecheck
npm run build
```

빌드 결과물은 `dist` 디렉터리에 생성되며, `firebase.json`의 Hosting publish 디렉터리도 `dist`로 지정되어 있습니다.

빌드된 결과를 로컬에서 확인하려면 다음을 실행합니다.

```bash
npm run preview
```

## Firebase Hosting 배포

이 프로젝트는 **Firebase Hosting만** 사용하도록 구성되어 있습니다. Firebase CLI가 없다면 먼저 설치합니다.

```bash
npm install -g firebase-tools
firebase login
```

현재 기본 Firebase 프로젝트는 `carebrief-co-kr`로 연결되어 있습니다. 다른 Firebase 프로젝트로 복제해 사용할 때는 `.firebaserc`의 프로젝트 ID를 교체합니다.

```json
{
  "projects": {
    "default": "carebrief-co-kr"
  }
}
```

그다음 빌드하고 Hosting으로 배포합니다.

```bash
npm run build
firebase deploy --only hosting
```

### Spark Plan 사용 안내

이 사이트는 **Spark Plan 사용, 결제수단 등록 없이 배포 가능**한 Firebase Hosting 정적 사이트 구조입니다.

과금 가능성을 줄이기 위해 다음 Firebase 기능은 사용하지 않습니다.

- Firestore
- Cloud Storage
- Cloud Functions
- Firebase App Hosting

Firebase Hosting 무료 제공량과 정책은 변경될 수 있으므로 실제 운영 전 Firebase Console의 현재 플랜과 사용량을 확인하세요.

## 개인정보 저장 안내

- 입력한 정보는 현재 브라우저의 React 상태에서 리포트 미리보기를 만드는 동안만 사용됩니다.
- 입력값을 서버로 전송하거나 Firebase에 저장하는 코드가 없습니다.
- 페이지를 새로고침하면 입력한 내용은 사라집니다.
- 민감한 건강정보를 입력하기 전에 실제 운영 주체의 개인정보 처리 방식을 반드시 안내해야 합니다.
- 본 서비스는 진단이나 처방을 제공하지 않습니다.

## Google Forms 링크 교체

`src/App.tsx` 상단의 아래 값을 실제 Google Forms 공유 링크로 교체합니다.

```ts
const BETA_FORM_URL = "{{Google Forms URL}}";
```

예시:

```ts
const BETA_FORM_URL = "https://forms.gle/실제공유링크";
```

현재 플레이스홀더 상태에서는 베타테스터 버튼을 눌렀을 때 링크 교체 안내가 표시됩니다. 실제 링크로 교체하면 새 탭에서 Google Forms가 열립니다. 베타테스터 신청은 유료 가입이나 결제가 아닙니다.

## 배포 전 확인

- `.firebaserc`의 Firebase 프로젝트 ID 확인
- `BETA_FORM_URL`의 Google Forms 링크 교체
- `npm run typecheck` 통과 확인
- `npm run build` 통과 확인
- 실제 모바일 화면에서 입력 → 미리보기 → 인쇄 흐름 확인
- 브라우저 인쇄 화면에서 A4 한 장 출력 확인
