"""원본 규칙만 떼어낸 대조군 — Day 3 세 저장소에서 그대로 복사했다.

JS 포팅본(`site/src/lib/day-03-rules.mjs`)과 같은 입력을 먹여 결과를 비교하려고
만든 파일이다. 함수 본문은 원본과 한 글자도 다르지 않아야 한다.

  · energy-agent  app/agent/graph.py  — wants_chart · _rule_route
  · support-agent app/agent/graph.py  — topics_in · _routing_plan
  · coding-agent  app/agent/cost.py   — estimate_call · estimate_run
                  app/agent/graph.py  — assign_model

coding-agent의 원본은 단가를 litellm의 `cost_per_token`에서 가져온다. 여기서는
그 함수가 돌려주는 값을 표로 박아 두었다(확인하는 법은 포팅 기록 참고).

    python3 scripts/day-03-rules-reference.py scripts/day-03-rules-cases.json
"""

from __future__ import annotations   # 호스트 파이썬이 3.9여도 돌게

import json
import sys

# ── energy-agent: 하이브리드 라우팅 ──────────────────────────────────

CHART_WORDS = ("그래프", "차트", "그림", "추이", "시각", "보여")


def wants_chart(question: str) -> bool:
    return any(word in question for word in CHART_WORDS)


def _rule_route(state) -> tuple[str, str] | None:
    """코드로 확정할 수 있는 결정. (다음 담당, 이유) 또는 None."""
    if not state["hybrid"]:
        return None
    done_agents = set(state["findings"])
    if state.get("answer"):
        return "done", "규칙: 답변이 나왔다"
    if "analyst" not in done_agents:
        return "analyst", "규칙: 자료가 없으면 분석부터"
    if wants_chart(state["question"]) and "visualizer" not in done_agents:
        return "visualizer", "규칙: 그래프를 명시적으로 요청했다"
    return None


# ── support-agent: 라우팅 기준 셋 ────────────────────────────────────

TOPIC_WORDS = {
    "billing": ("요금", "청구", "금액", "초과", "로밍", "할인", "납부", "미납", "결제"),
    "tech": ("인터넷", "안 돼", "안돼", "안 되", "끊", "속도", "느리", "먹통", "장애",
             "공유기", "와이파이", "데이터가"),
    "retention": ("해지", "위약금", "약정", "번호이동", "탈퇴", "옮기"),
}

AGENTS = {"triage": "접수 상담원", "billing": "요금 담당",
          "tech": "기술지원 담당", "retention": "해지방어 담당"}

HANDOFF_TARGETS = {"transfer_to_billing": "billing", "transfer_to_tech": "tech",
                   "transfer_to_retention": "retention"}

HANDOFFS_ALLOWED = {
    "triage": ["transfer_to_billing", "transfer_to_tech", "transfer_to_retention"],
    "billing": ["transfer_to_tech", "transfer_to_retention"],
    "tech": ["transfer_to_billing", "transfer_to_retention"],
    "retention": ["transfer_to_billing", "transfer_to_tech"],
}

MAX_HANDOFFS = 3


def topics_in(text: str) -> set:
    return {name for name, words in TOPIC_WORDS.items() if any(w in text for w in words)}


def _routing_plan(state, name: str) -> tuple[list, bool, str]:
    allowed = list(HANDOFFS_ALLOWED[name])
    if state.get("turn_handoffs", 0) >= MAX_HANDOFFS:
        return [], False, "한 턴 이양 상한"

    if not state["rules"]:
        return allowed, False, ""

    came_from = state.get("came_from") or ""
    note = ""
    back = next((k for k, v in HANDOFF_TARGETS.items() if v == came_from), None)
    if back in allowed:
        allowed.remove(back)
        note = f"규칙: {AGENTS[came_from]}에게 되돌리지 않는다"

    if name == "triage" and len(topics_in(state["message"])) >= 2:
        return [], True, "규칙: 문의가 둘 이상이라 되묻는다"

    return allowed, name == "triage", note


# ── coding-agent: 비용 추정 ──────────────────────────────────────────

EXPECTED_OUT_TOKENS = {"backend": 1500, "frontend": 1800, "tests": 1000, "planner": 600}

# litellm.cost_per_token()이 돌려주는 단가 (1M 토큰당 달러)
PRICES = {
    "gemini/gemini-3.5-flash": (1.5, 9.0),
    "gemini/gemini-3.5-flash-lite": (0.3, 2.5),
}

TIER_MODEL = {"strong": "gemini/gemini-3.5-flash", "cheap": "gemini/gemini-3.5-flash-lite"}


def assign_model(difficulty: str) -> str:
    return TIER_MODEL["strong" if difficulty == "hard" else "cheap"]


def estimate_call(model: str, role: str, prompt_chars: int) -> dict:
    in_tokens = max(200, prompt_chars // 2)
    out_tokens = EXPECTED_OUT_TOKENS.get(role, 1000)
    price_in, price_out = PRICES.get(model, (0.0, 0.0))
    cost = in_tokens * price_in / 1e6 + out_tokens * price_out / 1e6
    return {"role": role, "model": model, "in_tokens": in_tokens,
            "out_tokens": out_tokens, "cost_usd": round(cost, 6)}


def estimate_run(tasks: list, prompt_chars: int) -> dict:
    per_task = [estimate_call(t["model"], t["role"], prompt_chars) for t in tasks]
    return {"per_task": per_task,
            "total_usd": round(sum(item["cost_usd"] for item in per_task), 6)}


# ── 대조용 실행 ──────────────────────────────────────────────────────

ROLES = ("backend", "frontend", "tests")


def main() -> None:
    cases = json.load(open(sys.argv[1], encoding="utf-8"))
    out = {"supervisor": [], "handoff": [], "cost": []}

    for case in cases["supervisor"]:
        decided = _rule_route(case)
        out["supervisor"].append(None if decided is None
                                 else {"next": decided[0], "why": decided[1]})

    for case in cases["handoff"]:
        allowed, must_use_tool, note = _routing_plan(case, case["desk"])
        out["handoff"].append({"allowed": allowed, "must_use_tool": must_use_tool,
                               "note": note})

    for case in cases["cost"]:
        tasks = [{"role": role, "model": assign_model(difficulty)}
                 for role, difficulty in zip(ROLES, case["difficulties"])]
        out["cost"].append(estimate_run(tasks, case["prompt_chars"]))

    json.dump(out, sys.stdout, ensure_ascii=False, indent=1, sort_keys=True)


if __name__ == "__main__":
    main()
