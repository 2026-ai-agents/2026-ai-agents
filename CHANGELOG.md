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
- **diet-agent 수제 루프 대조군(v1.1.0)**: 같은 에이전트를 그래프 없이 짠
  `demos/handloop.py`를 교안의 "LangGraph란 무엇인가" 절에 나란히 배치.
  실행 결과와 각본 LLM 테스트 포함. v1.0.1은 trace 데모의 thread_id 누락
  hotfix
- **booking-agent 저장소 개설**: 손님/사장 두 입장의 식당 예약 웹 제품.
  v0.1(메모리 휘발) → v0.2(pg checkpointer) → v0.3(쓰기 직전 interrupt) →
  v1.0(사장 대시보드·어시스턴트·읽기 전용 SQL 도구·time-travel), 태그
  전부 테스트 통과, v1.0.1 포함 GitHub Releases 5건
- **booking-agent 현장 피드백 반영(v1.1.0)**: 재로그인 시 checkpointer에서
  대화 복원(대기 중 확인 카드 포함), 내 예약 클릭으로 상담 재개, 전화번호
  정규화. 교안에 실측 화면과 함께 추가
- **booking-agent 더 단단하게(v1.2.0)**: db에 named volume이 붙어
  down/up에도 예약·대화가 생존(초기화는 down -v로만), 손님·사장 화면 모두
  새로고침을 넘어 로그인 유지. 손님은 id, 사장은 발급 토큰을 쓰고
  비밀번호는 URL에 싣지 않는다
- **Day 2 3세션 교안**: booking-agent 교안 `day-02-session-03`. 재시작
  기억상실과 생존의 대조 실측, 확인 카드·사장 대시보드·SQL 방어·time-travel
  실측과 스크린샷 5장 동봉. 세션 인덱스의 "준비 중" 해제
- **secretary-agent 저장소 개설**: 단기/장기 기억의 구분을 배우는 개인
  비서 웹 제품. v0.1(thread에 갇힌 기억) → v0.2(store 서랍) → v0.3(기억
  판단 노드) → v1.0(의미 검색·기억 갱신·pgvector), 태그 전부 테스트 통과,
  GitHub Releases 4건
- **Day 2 4세션 교안**: secretary-agent 교안 `day-02-session-04`. 새 대화
  백지와 생존의 대조, 두 사실 두 서랍, 기억 판단·갱신·의미 검색 실측과
  완성 장면 스크린샷 동봉. 세션 인덱스의 "준비 중" 해제
- **Day 1 세션 슬라이드 7종**: `day-01-session-02`\~`-08` 덱을 세션 교안과
  1:1로 신설, 모두 330장. 각 덱은 교안의 예제 실행 결과·mermaid·코드 포인트를
  발표 흐름으로 재구성하고, 강의 문서의 `slides` 프론트매터로 연결했다.
  분량은 세션 시간 기준 분당 1.5장

### 변경

- **Day 2 개요를 세션 색인으로 축소**: 세션 목록, 개념의 이어달리기,
  사다리 요약, 실패 재현 시나리오만 남김
- **오리엔테이션 덱 확장**: `day-01-session-01`을 6장에서 22장으로.
  컨테이너 이름 규약, 사다리의 세 가지 약속, `check_env.py` 점검 항목,
  비용 실측 표, 3일 로드맵을 교안과 맞춰 채우고 나머지 Day 1 덱과 같은
  밀도로 맞췄다. 덱 인덱스 정렬용 `order`도 8개 덱 전부에 부여

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
