"""강의 시각화용 실측 데이터 추출 — Chroma의 진짜 768차원 벡터를 2D로 투영한다.

  docker compose exec -T app python - < extract_space.py

출력: JSON 한 덩어리 (stdout). 음식 1000건의 2D 좌표 + 프리셋 질의의
2D 좌표와 진짜 top-k 코사인 유사도. 2D는 보여 주기 위한 그림자이고,
순위는 언제나 768차원에서 계산한다.
"""

import json
import sys

import numpy as np
import psycopg

from agent.search import DATABASE_URL, chroma_collection, embed

QUERIES = [
    "든든한 국물 요리",
    "매콤한 볶음 요리",
    "해장에 좋은 뜨끈한 탕",
    "아침에 간단히 먹을 빵",
    "달콤한 후식",
    "100kcal 이하의 저칼로리 음식",
]
TOPK = 8

col = chroma_collection()
got = col.get(include=["embeddings", "metadatas"])
ids = [int(m["food_id"]) for m in got["metadatas"]]
V = np.asarray(got["embeddings"], dtype=np.float64)

# 코사인은 방향만 보므로 길이를 1로 맞춘다 (투영도 순위도 방향 기준)
V /= np.linalg.norm(V, axis=1, keepdims=True)

with psycopg.connect(DATABASE_URL) as conn:
    rows = conn.execute(
        "SELECT id, name, category, kcal, wiki_title FROM foods"
    ).fetchall()
meta = {r[0]: r for r in rows}

# PCA: 평균을 빼고 SVD. 상위 2개 주성분이 그림의 x·y가 된다.
mean = V.mean(axis=0)
X = V - mean
_, S, Wt = np.linalg.svd(X, full_matrices=False)
W = Wt[:2].T                       # (768, 2)
P = X @ W                          # (1000, 2)
explained = float((S[:2] ** 2).sum() / (S**2).sum())

# 좌표를 -1~1로 정규화 (그림에서 쓰기 쉽게) — 같은 배율을 질의에도 적용한다
scale = np.abs(P).max()
P = P / scale

foods = []
for i, fid in enumerate(ids):
    _, name, category, kcal, wiki = meta[fid]
    foods.append({
        "id": fid,
        "n": name,
        "c": category,
        "k": None if kcal is None else round(float(kcal), 1),
        "w": bool(wiki),
        "x": round(float(P[i][0]), 4),
        "y": round(float(P[i][1]), 4),
    })

index_of = {fid: i for i, fid in enumerate(ids)}

queries = []
for q in QUERIES:
    qv = np.asarray(embed([q])[0], dtype=np.float64)
    qv /= np.linalg.norm(qv)
    sims = V @ qv                                  # 768차원에서의 진짜 코사인
    order = np.argsort(-sims)[:TOPK]
    qp = ((qv - mean) @ W) / scale
    queries.append({
        "q": q,
        "x": round(float(qp[0]), 4),
        "y": round(float(qp[1]), 4),
        "hits": [{"id": ids[j], "s": round(float(sims[j]), 3)} for j in order],
        # 768개 성분 전부 — 화면에 색 띠로 그려 "차원 수"를 눈에 보이게 한다
        "full": [float(v) for v in qv],
    })

# 벡터의 생김새를 보여 줄 표본 몇 건 (앞 24개 성분)
samples = []
for name in ("삼계탕", "닭곰탕", "김치찌개", "초코케이크"):
    hit = next((fid for fid in ids if meta[fid][1] == name), None)
    if hit is None:
        continue
    j = index_of[hit]
    samples.append({
        "n": name,
        "full": [float(v) for v in V[j]],
    })

# 표본 사이의 진짜 코사인 유사도 (각도 설명용)
pairs = []
for a in range(len(samples)):
    for b in range(a + 1, len(samples)):
        ja = index_of[next(f for f in ids if meta[f][1] == samples[a]["n"])]
        jb = index_of[next(f for f in ids if meta[f][1] == samples[b]["n"])]
        pairs.append({"a": samples[a]["n"], "b": samples[b]["n"],
                      "s": round(float(V[ja] @ V[jb]), 3)})

json.dump({
    "dims": int(V.shape[1]),
    "count": len(foods),
    "explained": round(explained, 4),
    "categories": sorted({f["c"] for f in foods}),
    "foods": foods,
    "queries": queries,
    "samples": samples,
    "pairs": pairs,
}, sys.stdout, ensure_ascii=False)
