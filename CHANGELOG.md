# Changelog

AI Agent 실전 강의 자료 저장소의 주요 변경 사항을 기록한다.

형식은 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)를 따르고,
[유의적 버전](https://semver.org/lang/ko/)을 준수한다. 릴리스는 저장소 루트의
git 태그(`vX.Y.Z`)로, 사이트 버전은 `site/package.json`으로 관리한다.

에이전트 저장소들의 `v0.1\~v1.0` 릴리즈 사다리는 이 버전과 무관하다.
이 버전은 강의 자료의 버전이다.

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
