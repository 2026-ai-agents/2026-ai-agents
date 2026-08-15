# 하네스 게이트 포팅 기록

Day 1 7세션의 `<HarnessGates />`가 쓰는 판정 모듈
`site/src/lib/harness-gates.mjs`가 파이썬 원본과 같은 규칙인지의 대조 기록.

## 왜 옮겨도 되는가

사이트는 GitHub Pages라 파이썬을 돌릴 수 없다. 그런데 이 네 방어는 전부
**결정적**이다. 같은 입력에 언제나 같은 답이 나오므로, 규칙을 그대로 옮기면
브라우저에서 돌아가는 것이 원본의 흉내가 아니라 원본과 같은 판정이 된다.

| 게이트 | 원본 | 규칙의 실체 |
| --- | --- | --- |
| 경로 감금 | `examples/06_harness/07_path_jail.py` | `resolve()` 후 `is_relative_to()` |
| 출력 필터 | `examples/06_harness/06_output_filter.py` | 정규식 4개를 순서대로 치환 |
| 도구 권한 | `examples/06_harness/05_tool_permission.py` | 레지스트리의 위험 등급 조회 |
| budget guard | `examples/06_harness/09_budget_guard.py` | 누적 합과 임계 두 개의 부등호 |

**인젝션 방어는 옮기지 않았다.** 그쪽 결과는 모델의 판단이라 확률이고,
브라우저에서 재현하면 "언제나 막힌다"는 거짓 확신을 준다. 교안이 정확히 그
반대("보장이 없다")를 말하고 있으므로 넣으면 안 되는 것이다.

## 대조하는 법

```sh
node scripts/harness-gates-compare.mjs scripts/harness-gates-cases.json > js.json
python3 scripts/harness-gates-reference.py scripts/harness-gates-cases.json > ref.json
diff <(python3 -m json.tool js.json) <(python3 -m json.tool ref.json)
```

`harness-gates-reference.py`는 원본 함수 본문을 그대로 떼어 온 대조군이다.
경로 29건(경로 13 · 필터 7 · 도구 5 · 예산 4)에서 **전 항목이 일치**하는 것을
확인했다. 판정 모듈을 고치면 이 대조를 다시 돌린다.

## 옮기면서 확인한 것

- **`Path.resolve()`의 대역**: symlink가 없는 환경이므로 `.`과 `..`를 접는
  것으로 충분하다. 파이썬의 `JAIL / requested`는 오른쪽이 절대경로면 왼쪽을
  통째로 갈아치우는데(`/etc/passwd`가 감옥 밖으로 나가는 이유), 이 성질도
  그대로 옮겼다
- **정규식 순서를 손대지 않았다**: 원본은 `sk-[A-Za-z0-9\-_]{16,}`가
  `sk-ant-…`보다 앞에 있어서, Anthropic 키가 "OpenAI 계열 키"라는 이름으로
  가려진다. 가려진다는 결과는 같고 이름만 어긋나는 성질이다. 포팅하면서
  바로잡으면 규칙이 달라져 대조가 깨지므로 그대로 두고, 화면에서 이 성질을
  설명으로 드러낸다
- **JAIL 경로**: 랩 컨테이너의 `WORKDIR`이 `/app`이므로
  `Path("workspace").resolve()`는 `/app/workspace`다
