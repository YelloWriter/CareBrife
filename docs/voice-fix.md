# 음성 입력 오류 수정 — 2026-09-28

## 확인한 문제와 조치

1. 브라우저 SpeechRecognition이 `network` 오류를 반환해 받아쓰기에 진입하지 못함. 연결 실패·서비스 사용 불가·API 미지원 시 MediaRecorder와 기기 내 Whisper WASM worker로 전환한다. 새로 녹음하는 시점임을 안내한다.
2. WebLLM 0.2.84에서 `response_format: {type: "json_object"}`의 schema가 없으면 WASM이 `Cannot pass non-string to std::string` 오류를 냄. 문장 번호 배열을 제한하는 JSON schema 문자열을 전달하고 기존 누락·중복 검증을 유지한다.
3. 일부 브라우저는 마지막 인식 결과를 final로 확정하지 않고 종료함. 최신 결과 스냅샷의 임시 문장도 보존한다.
4. AI 분류 실패·시간 초과가 작성 흐름을 막음. 원문을 규칙으로 분리해 확인·수정 화면으로 이어지고, AI 정리가 완료되지 않았음을 표시한다.

## 검증 근거

- 타입 검사, Next.js 배포 빌드 통과.
- 로컬 Playwright 19개 테스트 통과. 실제 마이크를 켜지 않고 macOS Yuna로 만든 가상 한국어 문장을 AudioContext→MediaStream→**실제 MediaRecorder**→16kHz 디코딩→**실제 WASM Whisper**로 변환했다. 약 8초짜리 합성 음성에서 한국어 문장 생성 확인, 마이크 트랙 해제·콘솔 예외 없음·POST 전송 없음 확인.
- CI 기본 18개 검사는 모의 음성 이벤트/worker를 사용하며, 실제 모델 검사는 `LOCAL_ASR_FIXTURE` 환경 변수로 명시적으로 실행한다. README에 재현 방법을 기록했다.
- Codex 브라우저의 별도 테스트 탭에서 가상 문장으로 실제 WebGPU/WebLLM 분류를 실행하여 확인 화면 도착과 콘솔 오류 없음 확인.
- 라이브러리 설치 감사: 알려진 취약점 0건(Transformers.js 4.3.0).

실제 사용자의 음성·건강정보를 테스트에 사용하거나 기록하지 않았다. 기기별 음성 인식 정확도는 다를 수 있으며 받아쓴 내용을 사용자가 검토하는 화면을 유지한다. 최초 음성 모델 다운로드에는 인터넷과 시간이 필요하다. 브라우저 마이크 권한 거부는 자동으로 우회하지 않는다.
