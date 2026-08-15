"""원본 규칙만 떼어낸 대조군 — day-01/examples/06_harness/ 에서 그대로 복사했다.

JS 포팅본과 같은 입력을 먹여 결과를 비교하려고 만든 파일이다. 함수 본문은
원본과 한 글자도 다르지 않아야 한다.
"""

import json
import re
import sys
from pathlib import PurePosixPath

# --- 07_path_jail.py ---
JAIL = PurePosixPath("/app/workspace")


def _resolve(p: PurePosixPath) -> PurePosixPath:
    """symlink 없는 환경에서의 Path.resolve() — `.`과 `..`를 접는다."""
    parts = []
    for seg in str(p).split("/"):
        if seg in ("", "."):
            continue
        if seg == "..":
            if parts:
                parts.pop()
        else:
            parts.append(seg)
    return PurePosixPath("/" + "/".join(parts))


def safe_path(requested: str):
    resolved = _resolve(JAIL / requested)
    if not resolved.is_relative_to(JAIL):
        return {"allowed": False, "resolved": str(resolved), "verdict": "PermissionError"}
    rel = str(resolved.relative_to(JAIL))
    return {"allowed": True, "resolved": str(resolved), "verdict": rel}


# --- 06_output_filter.py (원본 순서 그대로) ---
SECRET_PATTERNS = [
    (re.compile(r"sk-[A-Za-z0-9\-_]{16,}"), "OpenAI 계열 키"),
    (re.compile(r"AIza[A-Za-z0-9\-_]{20,}"), "Google API 키"),
    (re.compile(r"sk-ant-[A-Za-z0-9\-_]{16,}"), "Anthropic 키"),
    (re.compile(r"\b\d{3}-\d{2}-\d{6}\b"), "주민등록번호 형태"),
]


def filter_output(text: str):
    findings = []
    for pattern, label in SECRET_PATTERNS:
        if pattern.search(text):
            findings.append(label)
            text = pattern.sub(f"[{label} — 가림]", text)
    return {"filtered": text, "findings": findings}


# --- 05_tool_permission.py ---
REGISTRY = {
    "get_exchange_rate": {"risk": "safe"},
    "search_places": {"risk": "safe"},
    "pay_deposit": {"risk": "dangerous"},
    "cancel_booking": {"risk": "dangerous"},
}


def execute(name: str, args: dict, approved: bool = False):
    risk = REGISTRY[name]["risk"]
    if risk == "dangerous" and not approved:
        return {"blocked": f"{name}은 승인 필요. 사용자에게 확인을 받아라."}
    return {"ok": f"{name}({args}) 실행됨"}


# --- 09_budget_guard.py ---
def run_guard(costs, warn_usd, stop_usd):
    spent, warned, steps = 0.0, False, []
    for cost in costs:
        spent += cost
        if spent >= stop_usd:
            steps.append({"cost": cost, "spent": round(spent, 10), "state": "stop"})
            return {"steps": steps, "stopped": True}
        state = "go"
        if spent >= warn_usd and not warned:
            warned, state = True, "warn"
        steps.append({"cost": cost, "spent": round(spent, 10), "state": state})
    return {"steps": steps, "stopped": False}


cases = json.load(open(sys.argv[1]))
out = {
    "path": [safe_path(p) for p in cases["paths"]],
    "filter": [filter_output(t) for t in cases["texts"]],
    "tool": [execute(n, a, ap) for n, a, ap in cases["tools"]],
    "budget": [run_guard(c, w, s) for c, w, s in cases["budgets"]],
}
json.dump(out, sys.stdout, ensure_ascii=False, indent=1)
