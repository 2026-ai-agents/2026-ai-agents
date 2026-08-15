# 컨텍스트 팽창 시각화 데이터

Day 1 5세션의 `<ContextGrowth />`가 쓰는
`site/src/data/context-growth.json`을 어떻게 만들었는지의 재현 기록.

지어낸 숫자가 없다. `day-01` 저장소의 v1.0 에이전트를 실제로 돌리면서 **매
호출에 실려 간 messages 배열을 통째로 뜨고**, 프로바이더가 돌려준
`prompt_tokens`를 받아 적었다. compact 전후의 토큰도 같은 자로 쟀다.

## 만드는 법

```sh
# day-01 저장소에서 (키 필요 — 에이전트를 실제로 돌린다)
docker compose up -d

# 배열이 자라는 과정
docker compose exec -T lab python - < …/2026-ai-agents/scripts/extract-context-growth.py > growth.json

# compact 전후
docker compose exec -T lab python - < …/2026-ai-agents/scripts/extract-compact.py > compact.json
```

두 산출물을 합쳐 `site/src/data/context-growth.json`으로 줄인다. 배열이
**덧붙이기 전용**이라 각 스텝은 최종 배열의 앞부분과 정확히 같으므로, 최종
배열 한 벌과 스텝별 길이만 담으면 모든 스텝을 되살릴 수 있다. 그래서 파일이
4.7KB다.

## 두 스크립트가 하는 일

`scripts/extract-context-growth.py`

- `react.completion`을 감싸서, 호출 직전의 `messages`를 그대로 뜬다
- 응답의 `usage.prompt_tokens`를 함께 받아 적는다 (근사 토크나이저가 아니라
  프로바이더가 센 값)
- 메시지는 화면에 실을 만큼만 남긴다 (역할·도구 이름·앞부분 미리보기)

`scripts/extract-compact.py`

- 같은 경로를 한 번 더 타서 마지막 호출의 배열을 얻는다
- 2세션 9번이 설명하는 그대로 접는다: system 유지, 오래된 왕복은 **실제 LLM
  요약** 하나로 치환, 최근 왕복은 원문 유지
- 접기 전과 후를 각각 한 번씩 실제로 보내서 `prompt_tokens`를 받는다.
  성장 그래프와 같은 자로 재야 비교가 성립한다

## 실측하며 걸린 것 둘

- **자를 자리를 아무 데나 잡으면 안 된다.** 최근 4개만 남기려 했더니 그
  구간이 `role: tool` 메시지에서 시작해, 짝이 되는 `assistant`(tool_calls)를
  잃은 고아 메시지가 됐고 API가 요청을 거절했다. Day 2 2세션의 reducer 사고와
  같은 실패다. 자를 지점을 tool이 아닌 곳까지 앞으로 물려서 해결했고, 그
  보정이 실제로 일어났는지를 `cutSnapped`로 남긴다
- **마지막 호출은 입력이 오히려 줄어든다.** 메시지는 3개 늘었는데
  `prompt_tokens`가 1,679에서 1,239로 떨어졌다. 스텝 한도에 걸린 뒤의 마무리
  호출이라 `tools`를 싣지 않기 때문이다. 매 스텝 함께 가던 도구 스키마의
  무게가 여기서 드러난다. 4세션의 "도구 스키마도 토큰이다"의 실측이라
  화면에서도 이 스텝을 따로 설명한다

## 알아 둘 것

- 실행마다 모델의 도구 선택이 조금씩 달라서 스텝 수와 토큰도 달라진다.
  다시 뽑으면 본문 설명(마지막 호출에서 입력이 줄어든다 등)이 여전히 맞는지
  확인한다
- `answerHead` 같은 중간 산출물은 저장소에 넣지 않는다. 최종
  `site/src/data/context-growth.json`만 커밋한다
