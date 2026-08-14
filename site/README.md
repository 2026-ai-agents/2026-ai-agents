# site: AI Agent 실전 강의 사이트

[stack-site-builder](https://github.com/CodeComposeStudio/stack-site-builder) 테마 기반의
Astro 강의 사이트. 라우트·컴포넌트·스타일·마크다운 파이프라인은 테마가 제공하고,
이 디렉터리는 콘텐츠와 사이트 데이터만 공급한다.

- 언어: ko 단일 로케일 (루트에서 서빙)
- 사용 섹션: **강의(courses) · 슬라이드(slides) · 글(articles) · 용어집(glossary) · 소개(pages) · 도구 카탈로그(stacks)**
- 미사용: 개념(concepts, 콘텐츠가 생기면 켠다) · 샘플(samples) · 논문(papers)/제품(products, 기본 꺼짐)
- 공개: GitHub Pages 프로젝트 사이트. base 경로는 `/2026-ai-agents` (배포: [../docs/deployment.md](../docs/deployment.md))

## 개발

```sh
pnpm install
pnpm dev       # http://localhost:4321/2026-ai-agents/
pnpm build     # dist/ 정적 빌드
pnpm check     # astro check (타입 검사)
```

`base` 경로가 있으므로 dev 서버에서도 루트가 아니라 `/2026-ai-agents/`로 접속한다.

Docker로 돌리려면 **repo 루트에서** (Node/pnpm 설치 불필요):

```sh
docker compose up                            # 보기 전용 (소스 내장)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up  # site/ 바인드 마운트 + 핫리로드
```

## 콘텐츠 작성 위치

| 무엇 | 어디에 | 비고 |
| --- | --- | --- |
| 강의 | `src/content/courses/ko/<slug>.mdx` | `category`: `day-1` \| `day-2` \| `day-3` (src/data/course-categories.ts) |
| 슬라이드 | `src/content/slides/ko/<deck>/index.mdx` | `<Slide>` 단위로 작성, 이미지는 덱 폴더에 동봉 |
| 글 | `src/content/articles/ko/<slug>.mdx` | `category`: `notice` \| `guide` \| `lecture-note` (src/data/article-categories.ts) |
| 도구 | `src/content/stacks/ko/<slug>.mdx` | `category`: `runtime` \| `agent-stack` (src/data/categories.ts) |
| 소개 등 독립 페이지 | `src/content/pages/ko/<slug>.mdx` | `/<slug>/`로 렌더, `nav` 프론트매터로 헤더 노출 제어 |
| 용어집 | `src/data/glossary.mjs` | 본문에서 `[[용어]]` / `[[용어\|표시명]]`으로 참조 (미등록 용어는 빌드 실패) |

각 컬렉션에 시드 문서가 들어 있으니(Day 1\~3 개요, Day 1 슬라이드 뼈대,
공지·사전 준비 글, 도구 7종, 소개) 새 문서는 그것을 복사해 시작하면 된다.

강의 내용의 단일 원본은 저장소의 `docs/course-plan.md`다. 세부 교안을 채울
때는 그 문서를 근거로 삼는다.

문장 스타일·마크다운 이스케이프·슬라이드 줄바꿈 등 작성 규칙은
[../docs/writing-rules.md](../docs/writing-rules.md)를 따른다.

## 사이트 데이터

- `src/data/site.ts`: 사이트 이름, 로케일, 섹션 토글, cards 홈(히어로/카드/CTA), UI 문자열
- `src/data/course-categories.ts`: 강의 분류 (Day 1/2/3)
- `src/data/article-categories.ts`: 글 분류 (공지/안내/강의 노트)
- `src/data/categories.ts`: 도구 카탈로그 분류 (실행 환경/에이전트 스택)
- `src/data/glossary.mjs`: `[[용어]]` 위키링크의 중앙 용어집
- `astro.config.mjs`: 배포 도메인(`site`)과 base 경로

## 비공개(수강생 전용) 콘텐츠

아무 문서나 프론트매터에 `private: true`(+`teaser`)를 붙이면 본문이 암호화되어
로그인 후에만 보인다. 사용자·키는 `.env`의 `AAS_PRIVATE_*` 환경 변수로 관리한다.

**이 저장소는 공개다.** private 콘텐츠는 소스 저장소가 private일 때만 안전하므로,
여기서는 쓰지 않는다.
