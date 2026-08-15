"""compact 실측 — 오래된 왕복을 실제로 요약해 배열을 접고, 토큰을 다시 센다.

  docker compose exec -T lab python - < extract_compact.py

2세션 9번이 설명하는 compact를 그대로 수행한다: system은 그대로, 오래된
왕복은 LLM 요약 하나로 치환, 최근 왕복은 원문 유지. 접기 전후의 토큰은
litellm의 token_counter로 실제로 센다(같은 모델의 토크나이저).

앞의 extract_growth.py가 뜬 마지막 배열을 stdin이 아니라 여기서 다시
만든다. 루프를 한 번 더 돌리는 대신, 같은 질문으로 같은 경로를 탄다.
"""

import json
import sys

import litellm
from litellm import completion, token_counter

from agent import react
from agent.config import pick_model

litellm.suppress_debug_info = True

QUESTION = "3박 4일 오사카, 예산 80만원"
KEEP_RECENT = 4          # 최근 왕복 몇 개의 원문을 남길 것인가

captured = []
real_completion = react.completion


def spy(**kwargs):
    captured.append(json.loads(json.dumps(kwargs["messages"], ensure_ascii=False, default=str)))
    return real_completion(**kwargs)


react.completion = spy
react.run(QUESTION, max_steps=8)
react.completion = real_completion

model = pick_model()
full = captured[-1]                      # 마지막 호출에 실려 간 배열 전체

# 자를 자리를 아무 데나 잡으면 안 된다. role이 tool인 메시지는 짝이 되는
# assistant(tool_calls)와 붙어 있어야 하고, 떼면 API가 고아 메시지라며 거절한다.
# 그래서 자를 지점을 tool이 아닌 곳까지 앞으로 물린다.
cut = len(full) - KEEP_RECENT
while full[cut]["role"] == "tool":
    cut -= 1

system = full[0]
old = full[1:cut]
recent = full[cut:]

# 오래된 구간을 진짜로 요약한다 (사람이 손으로 쓴 문장이 아니다)
transcript = "\n".join(
    f"[{m.get('role')}] {(m.get('content') or json.dumps(m.get('tool_calls'), ensure_ascii=False))[:400]}"
    for m in old
)
summary = completion(
    model=model,
    messages=[
        {"role": "system", "content":
         "다음은 여행 플래너 에이전트의 지난 대화 기록이다. 이후 대화를 이어가는 데 "
         "필요한 사실만 간결한 한 문단으로 요약하라. 확인된 수치는 반드시 남긴다."},
        {"role": "user", "content": transcript},
    ],
).choices[0].message.content

compacted = [system, {"role": "user", "content": f"[지금까지의 요약] {summary}"}, *recent]

def measured(messages):
    """프로바이더가 세어 준 입력 토큰 — 성장 그래프와 같은 자다."""
    r = completion(model=model, messages=messages, max_tokens=1)
    return r.usage.prompt_tokens


out = {
    "model": model,
    "keepRecent": len(recent),
    "before": {
        "count": len(full),
        "tokens": measured(full),
        "counterTokens": token_counter(model=model, messages=full),
    },
    "after": {
        "count": len(compacted),
        "tokens": measured(compacted),
        "counterTokens": token_counter(model=model, messages=compacted),
    },
    "foldedCount": len(old),
    "summary": summary,
    "summaryTokens": token_counter(model=model, messages=[compacted[1]]),
    "note": "before/after tokens는 프로바이더가 돌려준 prompt_tokens (tools 없이 보낸 값)",
    "cutSnapped": len(full) - KEEP_RECENT != cut,
}
json.dump(out, sys.stdout, ensure_ascii=False)
