# 4단계 안내 일러스트

생성 도구: 내장 `image_gen.imagegen` (CLI/API 대체 경로 사용 안 함).

파스텔 블루·시안, 부드러운 3D 클레이 느낌, 투명 배경을 공통으로 사용했습니다. 원본 PNG는 생성 도구의 저장 위치에 보존하고, 사이트에서는 비율과 투명도를 유지한 640px WebP를 사용합니다.

| 단계 | 최종 사이트 자산 | 움직임 |
| --- | --- | --- |
| 말하기 | `public/illustrations/talk.webp` | 설명하는 인물의 작은 기울임과 말소리 파형 |
| 확인하기 | `public/illustrations/review.webp` | 함께 확인하는 자세와 순서대로 나타나는 체크 |
| 한 장 정리 | `public/illustrations/organize.webp` | 흩어진 문서가 한 장으로 모이는 동작 |
| 병원에서 보여주기 | `public/illustrations/clinic.webp` | 리포트가 전달되고 확인 표시가 나타나는 동작 |

최종 프롬프트 4개 전문: [illustration-prompts.json](illustration-prompts.json).

이미지는 실제 가족·의료진의 사진이 아닌 생성 일러스트입니다. 애니메이션은 생성된 이미지를 바탕으로 CSS 변형과 단계별 표시를 조합했습니다. 실제 영상 생성이나 프레임별 캐릭터 관절 애니메이션은 사용하지 않았습니다.
