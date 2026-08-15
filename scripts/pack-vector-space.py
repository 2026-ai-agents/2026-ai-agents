"""추출한 실측을 사이트가 실을 크기로 줄인다.

음식은 [id, 이름, 분류index, kcal, x, y] 배열로, 벡터 스트립은 int8 양자화 후
base64로. 좌표와 코사인 점수는 실측 그대로 두고 자릿수만 줄인다.
"""

import base64
import json
import sys

src = json.load(open(sys.argv[1]))

# 화면에서 이름을 붙일 세 무리. 나머지는 회색 "그 외"로 물러난다.
FAMILIES = [
    {"key": "soup", "label": "국 · 탕 · 찌개",
     "cats": ["국 및 탕류", "찌개 및 전골류"]},
    {"key": "bakery", "label": "빵 · 과자 · 음료",
     "cats": ["빵 및 과자류", "음료 및 차류", "유제품류 및 빙과류"]},
    {"key": "wok", "label": "볶음 · 구이 · 튀김",
     "cats": ["볶음류", "구이류", "튀김류"]},
]
fam_of = {c: i for i, f in enumerate(FAMILIES) for c in f["cats"]}

cats = src["categories"]
cat_idx = {c: i for i, c in enumerate(cats)}

foods = [[f["id"], f["n"], cat_idx[f["c"]], f["k"],
          round(f["x"], 3), round(f["y"], 3)] for f in src["foods"]]

fam_by_cat = [fam_of.get(c, 3) for c in cats]


def strip(vals: list[float]) -> str:
    """벡터를 색 띠로 그리기 위한 바이트 양자화 — 표시용이지 계산용이 아니다.

    최소·최대로 늘이면 바깥값 몇 개가 범위를 다 먹어 띠가 밋밋해진다.
    2–98 백분위로 자른 뒤 늘여야 성분마다 다른 값이라는 게 눈에 보인다.
    """
    s = sorted(vals)
    lo = s[int(len(s) * 0.02)]
    hi = s[int(len(s) * 0.98)]
    span = (hi - lo) or 1.0
    raw = bytes(min(255, max(0, int(round((v - lo) / span * 255)))) for v in vals)
    return base64.b64encode(raw).decode()


queries = [{
    "q": q["q"],
    "x": round(q["x"], 3),
    "y": round(q["y"], 3),
    "strip": strip(q["full"]),
    "hits": [[h["id"], h["s"]] for h in q["hits"]],
} for q in src["queries"]]

out = {
    "dims": src["dims"],
    "count": src["count"],
    "explained": src["explained"],
    "cats": cats,
    "famOfCat": fam_by_cat,
    "families": [{"key": f["key"], "label": f["label"]} for f in FAMILIES],
    "foods": foods,
    "queries": queries,
    "samples": [{"n": s["n"], "strip": strip(s["full"])} for s in src["samples"]],
    "pairs": src["pairs"],
}
json.dump(out, open(sys.argv[2], "w"), ensure_ascii=False, separators=(",", ":"))
print("wrote", sys.argv[2])
