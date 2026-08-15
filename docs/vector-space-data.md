# 벡터 공간 시각화 데이터

Day 2 5세션(`food-rag-agent`)의 `<VectorSpace />` 컴포넌트가 쓰는
`site/src/data/vector-space.json`을 어떻게 만들었는지의 재현 기록.

이 저장소의 다른 실행 결과와 마찬가지로 **지어낸 좌표가 아니다.** 실제로
돌아가는 `rag` 컨테이너에서 꺼낸 벡터이고, 표에 찍히는 코사인 점수는 768차원
원본에서 계산한 값이다. 강의 본문의 v0.1 시연 출력(`score=0.743` 국수전골
등)과 숫자가 정확히 일치하는 것도 같은 색인을 봤기 때문이다.

## 만드는 법

`food-rag-agent` 저장소를 띄우고 색인을 만든 상태에서 시작한다.

```sh
# food-rag-agent 저장소에서 (GEMINI_API_KEY 필요 — 질의 임베딩에 쓴다)
docker compose up -d
docker compose exec app python build_index.py

# 이 저장소의 스크립트를 app 컨테이너 안에서 돌린다
docker compose exec -T app python - < …/2026-ai-agents/scripts/extract-vector-space.py > space.json

# 사이트가 실을 크기로 줄인다
python3 …/2026-ai-agents/scripts/pack-vector-space.py space.json \
    …/2026-ai-agents/site/src/data/vector-space.json
```

`space.json`은 중간 산출물이라 저장소에 넣지 않는다. 최종 결과인
`site/src/data/vector-space.json`만 커밋한다.

## 두 스크립트가 하는 일

`scripts/extract-vector-space.py` (컨테이너 안에서 실행)

- Chroma에서 음식 1000건의 768차원 벡터를 전부 꺼낸다
- 길이를 1로 맞춘다. 코사인은 방향만 보므로 투영도 순위도 방향 기준이다
- 평균을 빼고 SVD를 돌려 상위 주성분 2개를 2차원 좌표로 삼는다 (PCA)
- 질의 6종을 **같은 임베딩 모델**로 벡터로 만들고, 같은 주성분에 투영해
  좌표를 얻는다. top-8은 2차원이 아니라 768차원 코사인으로 고른다
- 벡터를 색 띠로 그릴 표본 몇 건을 함께 담는다

`scripts/pack-vector-space.py` (호스트에서 실행)

- 음식을 `[id, 이름, 분류index, kcal, x, y]` 배열로 눕혀 용량을 줄인다
- 23개 분류를 화면에서 이름 붙일 세 무리와 "그 외"로 접는다
- 벡터 띠는 2\~98 백분위로 자른 뒤 바이트로 양자화해 base64로 넣는다.
  표시용이지 계산용이 아니다

## 알아 둘 것

- **주성분 2개는 원래 흩어짐의 9.9%만 담는다.** 그런데도 분류별로 뭉치는
  것이 보이는 것이 이 그림의 요점이고, 동시에 "2차원은 그림자"라는 경고의
  근거이기도 하다. 컴포넌트 하단 문구가 이 점을 밝힌다
- **x·y에 같은 배율을 쓴다.** 한쪽으로 늘이면 "가깝다"가 방향마다 달라진다.
  그래서 그림은 늘 정사각이고 좌우에 여백이 생긴다
- 색인이나 데이터가 바뀌면 좌표도 바뀐다. 본문 설명(예: 저칼로리 질의가
  어느 무리에도 속하지 못한다)과 어긋나지 않는지 다시 만든 뒤 확인한다
