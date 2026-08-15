"""컨텍스트 팽창 시각화용 실측 추출 — messages 배열이 스텝마다 어떻게 자라는가.

  docker compose exec -T lab python - < extract_growth.py

react 루프를 한 번 돌리되, completion을 감싸서 **매 호출에 실제로 실려 간
messages 배열**을 통째로 붙잡는다. 프로바이더가 돌려준 prompt_tokens도 같이
받아 적는다. 지어낸 숫자가 하나도 없어야 이 그림이 교재가 된다.
"""

import json
import sys

import litellm

from agent import react

QUESTION = "3박 4일 오사카, 예산 80만원"
MAX_STEPS = 8

snapshots = []
real_completion = react.completion


def spy(**kwargs):
    """호출 직전의 messages를 그대로 뜨고, 응답의 usage를 받아 적는다."""
    sent = json.loads(json.dumps(kwargs["messages"], ensure_ascii=False, default=str))
    response = real_completion(**kwargs)
    usage = response.usage
    snapshots.append({
        "messages": sent,
        "prompt_tokens": usage.prompt_tokens,
        "completion_tokens": usage.completion_tokens,
        "has_tools": "tools" in kwargs,
    })
    return response


react.completion = spy
litellm.suppress_debug_info = True

result = react.run(QUESTION, max_steps=MAX_STEPS)
react.completion = real_completion


def shrink(m):
    """화면에 실을 만큼만 남긴다. 원문은 길어서 페이지에 다 실을 수 없다."""
    role = m.get("role")
    text = m.get("content") or ""
    if not isinstance(text, str):
        text = json.dumps(text, ensure_ascii=False)
    calls = m.get("tool_calls") or []
    label = None
    if calls:
        fn = calls[0].get("function", {})
        label = fn.get("name")
        text = f"{fn.get('name')}({fn.get('arguments', '')})"
    return {
        "role": role,
        "tool": label or m.get("name"),
        "preview": text[:150],
        "chars": len(text),
    }


steps = []
for i, snap in enumerate(snapshots):
    prev = len(snapshots[i - 1]["messages"]) if i else 0
    steps.append({
        "n": i + 1,
        "promptTokens": snap["prompt_tokens"],
        "completionTokens": snap["completion_tokens"],
        # 이번 호출에 새로 붙은 메시지 수. 나머지는 전부 재전송이다.
        "fresh": len(snap["messages"]) - prev,
        "total": len(snap["messages"]),
        "messages": [shrink(m) for m in snap["messages"]],
        "hasTools": snap["has_tools"],
    })

json.dump({
    "question": QUESTION,
    "model": react.pick_model(),
    "maxSteps": MAX_STEPS,
    "stoppedBy": result.stopped_by,
    "answerChars": len(result.answer or ""),
    "answerHead": (result.answer or "")[:220],
    "steps": steps,
}, sys.stdout, ensure_ascii=False)
