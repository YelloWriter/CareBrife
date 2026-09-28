# Lighthouse 및 모션 점검

측정일: 2026-09-28. 공개 운영 URL `https://carebrief-iota.vercel.app/`을 로그인하지 않은 Chromium에서 측정했습니다. Lighthouse 13.5.0, 모바일 기본 시뮬레이션 및 1440×900 데스크톱 설정입니다. 정확한 조건은 `scripts/lighthouse.mjs`에 있습니다.

## 개선 전

| 환경 | 성능 | 접근성 | 권장사항 | SEO |
| --- | ---: | ---: | ---: | ---: |
| 모바일 | 97 | 100 | 100 | 100 |
| 데스크톱 | 100 | 100 | 100 | 100 |

[원본 측정값 요약](lighthouse-before.json). 기존 제출 당시의 로컬 측정과 이번 운영 측정은 조건이 다르므로 서로의 점수 차이를 개선량으로 해석하지 않습니다.

## 발견 사항과 수정

- 로고 이미지 전송량 및 LCP 우선순위: PNG 19,346바이트를 동일 해상도의 무손실 WebP 9,376바이트로 변환(약 52% 감소). 헤더 로고에 `fetchPriority="high"` 지정. PDF 삽입용 PNG 원본 유지.
- 반응형 이미지: 로고 176/340px, 히어로 심볼 96/192px WebP를 `srcSet`으로 제공해 실제 표시 크기·화면 밀도에 맞춰 다운로드. 기존 67,614바이트 심볼 PNG는 화면에서 3,090~5,876바이트 WebP로 대체.
- 제목 표시 지연: 중간 운영 재측정에서 모바일 LCP 4.7초(성능 82)가 관측되어 첫 화면 제목·설명·CTA의 지연 페이드인을 제거. 정보는 즉시 표시하며 아래 섹션의 스크롤 모션과 장식 모션을 유지.
- 불필요한 초기 DOM 작업: 한국어 원본 페이지는 번역용 전체 DOM 순회와 MutationObserver를 만들지 않도록 수정. 영어 번역은 유지.
- 스크롤 모션: 18px 이동·480ms 페이드·600ms 감속, 같은 그룹 60ms 간격(최대 180ms), 1회만 표시. 큰 섹션도 진입 즉시 나타나도록 개선.
- 스크롤 초기화의 크기 측정을 스타일 변경 전에 한 번에 수행하여 반복적인 강제 레이아웃 계산을 줄임.
- 키보드 포커스가 들어오면 콘텐츠를 즉시 표시. 실행 중 동작 줄이기 설정 변경에도 전체 콘텐츠를 표시하고 모션을 중단. JavaScript/IntersectionObserver가 없어도 정보는 보임.
- 접근성·SEO 자동 검사에서 실패 항목은 없었습니다. 반응형·키보드·입력 흐름은 별도 Playwright 검사로 보완합니다.

Lighthouse의 미사용 CSS/JavaScript 추정에는 한국어 유니코드별 글꼴 선언, 첫 화면 아래의 섹션 스타일, Next/React 런타임도 포함됩니다. 리포트 작성·한글 표시를 훼손하면서 자동 삭제하지 않았습니다. 자동 점수 100은 모든 접근성 문제나 실제 사용자 성능을 보장하지 않습니다.

## 재현

```sh
npm ci
npx playwright install chromium
AUDIT_URL=https://carebrief-iota.vercel.app AUDIT_OUTPUT_DIR=.lighthouse/production npm run audit:lighthouse
```

Chrome 실행 파일이 자동 감지되지 않으면 `PLAYWRIGHT_CHROMIUM_EXECUTABLE`을 지정합니다. 로컬 측정은 `npm run build`와 `npm run preview` 후 별도 터미널에서 `npm run audit:lighthouse`를 실행합니다. HTML·JSON 전체 리포트와 `summary.json`이 출력 폴더에 저장됩니다. 네트워크·CPU 부하에 따라 측정값이 달라질 수 있습니다.
