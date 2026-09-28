# PDF 전용 Noto Sans KR

- 원본: https://github.com/google/fonts/blob/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf
- 라이선스: SIL Open Font License, `OFL-NotoSansKR.txt`.
- 2026-09-28에 공식 Google Fonts 원본을 받아 fontTools 4.60.2로 `wght=400` 정적 TTF를 만들었습니다.
- PDF 작성 라이브러리의 문자별 위치/너비와 불일치하는 대체 글리프를 사용하지 않도록 이 **PDF 전용** 파일에서 GSUB·GPOS를 제거했습니다. 웹 화면 글꼴은 변경하지 않습니다. 한글은 NFC로 정규화해 그립니다.
- pdf-lib에서 전체 글꼴을 포함합니다. 서브셋 결과는 한글 일부가 화면에서 사라지는 문제가 있어 사용하지 않습니다. 텍스트 추출만으로 검증하지 말고 PDF를 렌더링해 확인하세요.

변환 재현:

```python
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
font = instantiateVariableFont(TTFont("NotoSansKR[wght].ttf"), {"wght": 400}, inplace=True)
for tag in ("GSUB", "GPOS"):
    if tag in font:
        del font[tag]
font.save("NotoSansKR-Regular.ttf")
```
