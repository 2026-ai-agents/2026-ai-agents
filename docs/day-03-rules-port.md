# Day 3 규칙 포팅 기록

Day 3 세 세션의 인터랙티브 도구가 쓰는 판정 모듈
`site/src/lib/day-03-rules.mjs`가 파이썬 원본과 같은 규칙인지의 대조 기록.

## 왜 옮겨도 되는가

사이트는 GitHub Pages라 파이썬을 돌릴 수 없다. 그런데 아래 셋은 모델을
부르지 않고 코드만으로 답이 정해진다. 규칙을 그대로 옮기면 브라우저에서
돌아가는 것이 원본의 흉내가 아니라 **원본과 같은 판정**이 된다.

| 도구 | 세션 | 원본 | 규칙의 실체 |
| --- | --- | --- | --- |
| `<RoutingRules />` | 2세션 | energy-agent `app/agent/graph.py` | 낱말 검사와 부등호 세 줄 (`wants_chart`·`_rule_route`) |
| `<HandoffRules />` | 3세션 | support-agent `app/agent/graph.py` | 낱말로 갈래를 세고 목록에서 빼는 일 (`topics_in`·`_routing_plan`) |
| `<CostGate />` | 4세션 | coding-agent `app/agent/cost.py`·`graph.py` | 토큰 수 × 가격표 (`estimate_call`·`estimate_run`·`assign_model`) |

**LLM이 정하는 자리는 옮기지 않았다.** energy-agent에서 규칙이 `None`을
돌려주면 그다음은 모델의 판단이고, 그 판단은 실행마다 흔들린다. 교안이
정확히 그 흔들림을 재고 있으므로, 브라우저에서 재현하면 "언제나 이렇게
간다"는 거짓 확신을 준다. 도구들은 규칙이 끝내는 자리까지만 보여주고 거기서
멈추며, 화면에도 "여기부터는 LLM"이라고 적는다.

`<CostGate />`도 마찬가지다. 추정은 계산이라 그대로 돌지만 **실측은 옮기지
않았다.** 실제로 얼마가 나갈지는 모델이 얼마나 뱉느냐에 달렸고, 그 숫자는
교안의 실측표에 따로 있다.

## 단가는 어디서 왔나

coding-agent의 원본은 litellm의 `cost_per_token()`을 부른다. 포팅본은 그
함수가 돌려주는 값을 표로 박아 두었다. 다시 확인하려면 coding-agent에서
아래를 돌린다.

```sh
docker compose exec app python -c "
from litellm import cost_per_token
for m in ('gemini/gemini-3.5-flash', 'gemini/gemini-3.5-flash-lite'):
    print(m, cost_per_token(model=m, prompt_tokens=1_000_000, completion_tokens=0)[0],
             cost_per_token(model=m, prompt_tokens=0, completion_tokens=1_000_000)[1])"
```

2026-08-16 확인값(1M 토큰당 달러):

| 모델 | 입력 | 출력 |
| --- | --- | --- |
| `gemini/gemini-3.5-flash` | 1.5 | 9.0 |
| `gemini/gemini-3.5-flash-lite` | 0.3 | 2.5 |

가격표가 바뀌면 이 표와 `PRICES` 상수를 함께 고친다.

## 대조하는 법

케이스 460건(라우팅 60 · 이양 384 · 비용 16)을 두 구현에 먹여 결과를 비교한다.

```sh
node scripts/day-03-rules-compare.mjs scripts/day-03-rules-cases.json > js.json
python3 scripts/day-03-rules-reference.py scripts/day-03-rules-cases.json > ref.json
diff js.json ref.json
```

`scripts/day-03-rules-reference.py`는 원본 세 저장소에서 함수 본문을 그대로
복사한 대조군이다. **본문이 원본과 한 글자도 다르지 않아야 한다.**

## 실제 저장소와도 맞는지

대조군은 어디까지나 복사본이므로, 한 번 더 돌아가는 진짜 코드와 맞춰 봤다.
세 저장소를 띄우고 같은 케이스를 실제 함수에 먹인 결과다.

```sh
# 각 저장소에서 (support-agent는 8000 포트를 쓰지 않도록 run --rm 으로)
docker compose exec -T app python /tmp/xcheck_energy.py   > real_supervisor.json
docker compose run --rm -T app python /tmp/xcheck_support.py > real_handoff.json
docker compose exec -T app python /tmp/xcheck_coding.py   > real_cost.json
```

2026-08-16 결과:

```
supervisor  대조군  60건 vs 실제 저장소  60건 → 일치
handoff     대조군 384건 vs 실제 저장소 384건 → 일치
cost        대조군  16건 vs 실제 저장소  16건 → 일치

결론: 포팅본 = 대조군 = 실제 저장소 코드
```

비용 쪽은 이 대조가 특히 중요하다. 실제 저장소는 litellm의 가격표를 부르고
포팅본은 박아 둔 표를 쓰므로, 이 일치가 **단가가 아직 맞다는 증거**이기도
하다.

## 무엇이 바뀌면 다시 대조해야 하나

- 세 저장소의 해당 함수(낱말 목록·상한·예상 출력 토큰 포함)를 고쳤을 때
- litellm의 모델 가격표가 바뀌었을 때
- 모델 등급 배정(`TIER_MODEL`)을 바꿨을 때
