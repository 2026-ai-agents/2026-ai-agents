# Changelog

AI Agent 실전 강의 자료 저장소의 주요 변경 사항을 기록한다.

형식은 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)를 따르고,
[유의적 버전](https://semver.org/lang/ko/)을 준수한다. 릴리스는 저장소 루트의
git 태그(`vX.Y.Z`)로, 사이트 버전은 `site/package.json`으로 관리한다.

에이전트 저장소들의 `v0.1\~v1.0` 릴리즈 사다리는 이 버전과 무관하다.
이 버전은 강의 자료의 버전이다.

## [Unreleased]

### 추가

- **Day 2 세션 문서 시작**: `day-02-session-01`(도입)과
  `day-02-session-02`(diet-agent 교안) 두 편. diet-agent 교안은 릴리즈
  사다리 4단을 실측
  기반으로 해부한다. 태그별 시연 출력, reducer 누락 사고 2단 재현, 그리고
  이미지 동봉형 폴더 문서로 v0.1 빈 화면과 v1.0 멀티턴 상담의 실제 스크린샷
- **diet-agent 저장소 개설**: LangGraph 기본기를 얹은 식단 상담 웹 제품.
  v0.1\~v1.0 네 태그 전부에서 재빌드·테스트 통과, GitHub Releases 4건

### 변경

- **Day 2 개요를 세션 색인으로 축소**: 세션 목록, 개념의 이어달리기,
  사다리 요약, 실패 재현 시나리오만 남김

## [0.2.0] - 2026-08-15

### 추가

- **8세션(MCP)도 실행 가능한 교안으로**: `day-01` v1.1.0\~v1.2.0이
  `examples/07_mcp/` 시연 4종(서버로 내어놓기·프로토콜 수신·루프 연결·상주
  HTTP 접속)을 추가해, 시연 전용이던 세션 8도 실측 실행 결과를 담는다.
  stdio(클라이언트가 서버를 소유)와 HTTP(상주 서버에 접속)의 전송 차이를
  실험으로 대비한다
- **Day 1 세션 문서를 실측 교안으로 확장**: 세션 2\~7이 예제 51종 전부의
  "코드 발췌 → 실행 결과 → 읽기" 블록을 담는다. 2026-08-14에 실키 3사로
  전수 실행한 출력이며, 구조 설명 mermaid 4장을 함께 실었다. 전수 실행이
  잡아낸 예제 결함은 `day-01`의 hotfix v1.0.3(vision 이미지 경로,
  context_limit 한도 계산)·v1.0.4(시연 품질 5건)로 나갔다

- **Day 1 세션 문서 8개**: `/course/day-01-session-01/`부터 `-08/`까지.
  오리엔테이션, LLM API의 본질, LiteLLM, tool calling, ReAct, ReAct 너머의
  루프들, 하네스 엔지니어링, MCP 맛보기. 예제 표, 릴리즈 체크포인트,
  코드 포인터, 키 없이 재현한 실측 출력(토큰 비교·단가표·경로 감금·budget
  guard·태그별 테스트 수)을 담는다
- **Day 1 교재 저장소 `day-01` 개설**: 예제 51종 + 여행 플래너 에이전트가
  릴리즈 사다리 v0.1\~v1.0으로 자란 compose 실습 랩. 태그마다 유닛 테스트가
  통과한다 (5 → 16 → 17 → 21 → 33개)

### 변경

- **Day 1 개요를 세션 색인으로 축소**: 세션 목록 표와 사다리·실패 재현
  시나리오만 남기고 상세는 세션 문서로 이동
- **강의 order 키를 내림차순 공식으로 교체**: 3900(개요)·3899\~3892(세션)·
  2900·1900. 테마 정렬이 큰 값 우선이기 때문
- **Day 1 랩 저장소 이름 확정**: `day1-agent-lab`에서 `day-01`로. 클론 URL·
  저장소 표·규칙 예시를 전부 맞췄다
- **오리엔테이션 슬라이드 덱 이동**: `day-01`에서 `day-01-session-01`로,
  강의 슬러그와 1:1이 되도록

## [0.1.0] - 2026-08-14

기본 셋업. 강의 콘텐츠 본문은 아직 채우지 않았고, 구조와 배포 경로만 세웠다.

### 추가

- **강의 사이트**: `site/`에 stack-site-builder 기반 Astro 사이트. 한국어 단일
  로케일, cards 홈이며 강의·슬라이드·글·도구 카탈로그·용어집·소개 섹션을 쓴다.
  개념(concepts) 섹션은 콘텐츠가 생길 때까지 꺼 둔다
- **GitHub Pages 공개**: `main` push → `site/` 빌드 → Pages 배포 워크플로.
  프로젝트 사이트이므로 base 경로는 `/2026-ai-agents`이고, 로컬 개발 서버도
  같은 경로를 쓴다
- **Docker 실행**: 저장소 루트에서 `docker compose up`으로 사이트를 구동하고,
  `docker-compose.dev.yml`을 얹으면 `site/` 바인드 마운트로 핫리로드가 된다
- **커리큘럼 원안**: `docs/course-plan.md`. 외부 원본을 그대로 옮긴 파일이며
  강의 내용의 단일 원본이다
- **시드 콘텐츠**: 과정 소개 페이지, 공지와 사전 준비 가이드 글,
  Day 1\~3 개요 문서, Day 1 슬라이드 뼈대, 도구 7종(Docker·PostgreSQL·LiteLLM·
  LangGraph·Chroma·FastAPI·Streamlit)
- **용어집**: 에이전트·ReAct·Reflexion·하네스·checkpointer·store·supervisor·
  handoff·Agentic RAG·MCP 등 본문에서 `[[용어]]`로 링크되는 25개 용어
- **문서·규칙**: 작성 규칙(`writing-rules`), 문서 규칙(`documentation-rules`),
  git flow(`git-workflow`), 배포(`deployment`), 문서 스타일 검사
  스크립트(`scripts/check-style.py`), AI 도구용 가이드(`CLAUDE.md`)
