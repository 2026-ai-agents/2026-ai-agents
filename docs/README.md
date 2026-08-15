# docs

저장소 운영·개발 규칙 문서와 커리큘럼 원안

## 규칙 문서

- [writing-rules.md](writing-rules.md): 콘텐츠·문서 작성 규칙 (한글 문장
  스타일, 마크다운 이스케이프(표 파이프·물결표), 소프트 줄바꿈, 이 과정 고유의
  표기, 슬라이드 줄바꿈 체크)
- [documentation-rules.md](documentation-rules.md): 문서의 위치·파일명·구성
  규칙과 에이전트 저장소와의 역할 분담
- [git-workflow.md](git-workflow.md): git flow 브랜치 모델과 커밋 규칙
  (커밋하면서 진행, 커밋 전 검증, 메시지 스타일, 릴리스 절차)
- [deployment.md](deployment.md): GitHub Pages 공개 배포 (워크플로 동작,
  저장소 설정, base 경로)

## 인터랙티브 자료의 재현 기록

강의 문서에 실린 인터랙티브는 전부 실측이거나 원본 코드의 이식이다. 무엇을
어떻게 만들었는지는 각 문서에 남긴다.

- [vector-space-data.md](vector-space-data.md): Day 2 5세션의 벡터 공간
  시각화가 쓰는 `site/src/data/vector-space.json`을 실제 색인에서 뽑는 방법
  (`scripts/extract-vector-space.py`, `scripts/pack-vector-space.py`)
- [context-growth-data.md](context-growth-data.md): Day 1 5세션의 컨텍스트
  팽창·compact 시각화가 쓰는 `site/src/data/context-growth.json`을 실제
  에이전트 실행에서 뽑는 방법
  (`scripts/extract-context-growth.py`, `scripts/extract-compact.py`)
- [day-03-rules-port.md](day-03-rules-port.md): Day 3 인터랙티브 도구가 쓰는
  규칙의 포팅·대조 기록
- [harness-gates-port.md](harness-gates-port.md): Day 1 7세션의 게이트
  데모가 쓰는 `site/src/lib/harness-gates.mjs`가 파이썬 원본과 같은 규칙인지
  대조하는 방법 (`scripts/harness-gates-compare.mjs`,
  `scripts/harness-gates-reference.py`)

## 작업 계획

- [course-site-plan.md](course-site-plan.md): 강의 문서를 일차 단위에서 세션
  단위로 나누는 계획. 슬러그·프론트매터 규약(`order` 내림차순 주의), 세션 22개
  목록, 작업 순서, 그리고 커리큘럼 원안 점검 결과

## 커리큘럼 원안

- [course-plan.md](course-plan.md): 강의 기획 원안 v16. 3일 구성, 저장소별
  릴리즈 사다리, 사전 준비 가이드, 세션별 시간 배분까지 담겨 있다.
  **외부 원본을 그대로 옮긴 파일**이라 손대지 않고, 원본이 갱신되면 통째로
  교체한다. 작성 규칙과 스타일 검사에서도 제외한다.

## 일차별 강의 문서

일차별 교안은 강의 사이트의 course 문서가 단일 원본이다.
`site/src/content/courses/ko/`에 둔다. 예를 들어 Day 1은 `day-01.mdx`다.
슬라이드도 이 문서를 토대로 만든다. 운영용 보조 문서가 생기면 여기에 둔다.
