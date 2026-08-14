# 배포

강의 사이트는 GitHub Pages **프로젝트 사이트**로 공개된다. `main`에 push되면
워크플로가 `site/`를 정적 빌드해 올린다.

- 공개 주소: [2026-ai-agents.github.io/2026-ai-agents](https://2026-ai-agents.github.io/2026-ai-agents/)
- 워크플로: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)
- 트리거: `main` push, 그리고 수동 실행(workflow_dispatch)

## 저장소 최초 설정

한 번만 하면 된다.

1. GitHub 저장소 **Settings > Pages**로 간다
2. **Source**를 `Deploy from a branch`가 아니라 **`GitHub Actions`**로 바꾼다
3. `main`에 무언가 push하거나 Actions 탭에서 워크플로를 수동 실행한다

Source가 `GitHub Actions`가 아니면 워크플로는 성공해도 페이지가 갱신되지 않는다.

## base 경로

프로젝트 사이트는 저장소 이름 아래 경로에서 서빙되므로, Astro의 `base`가
그 경로와 정확히 일치해야 한다.

| 위치 | 값 |
| --- | --- |
| `site/astro.config.mjs`의 `site` | `https://2026-ai-agents.github.io` |
| `site/astro.config.mjs`의 `base` | `/2026-ai-agents` |
| 실제 주소 | `https://2026-ai-agents.github.io/2026-ai-agents/` |

- **저장소 이름을 바꾸면 `base`도 바꿔야 한다.** 안 바꾸면 CSS·JS·링크가 전부
  404가 난다.
- 로컬 개발 서버도 base를 그대로 쓴다. `pnpm dev` 후 접속 주소는
  `http://localhost:4321/2026-ai-agents/` 다.
- 커스텀 도메인을 붙이면 `base`를 `/`로 바꾸고 `site`를 그 도메인으로 바꾼 뒤,
  `site/public/CNAME`을 추가한다.

## 워크플로가 하는 일

1. `actions/checkout`으로 저장소를 받는다
2. `pnpm/action-setup`이 `site/package.json`의 `packageManager` 버전으로 pnpm을 깐다
3. `actions/setup-node`가 Node 26 + pnpm 캐시(`site/pnpm-lock.yaml` 기준)를 준비한다
4. `site/`에서 `pnpm install --frozen-lockfile && pnpm build`를 돌린다
5. `site/dist`를 Pages 아티팩트로 올리고 `deploy-pages`가 배포한다

`--frozen-lockfile`이므로 **`site/pnpm-lock.yaml`이 `package.json`과 맞지 않으면
빌드가 실패한다.** 의존성을 바꿨으면 락파일도 함께 커밋한다.

## 공개 저장소이므로 주의할 것

- **private(수강생 전용) 콘텐츠를 쓰지 않는다.** 테마의 `private: true`는 본문을
  암호화하지만, 소스 저장소가 공개면 원문이 그대로 보인다.
- API 키, 개인정보, 미공개 자료를 콘텐츠나 커밋에 넣지 않는다.

## 배포가 안 될 때

| 증상 | 확인할 것 |
| --- | --- |
| 워크플로는 성공, 페이지는 그대로 | Settings > Pages의 Source가 `GitHub Actions`인지 |
| 페이지는 뜨는데 CSS·링크가 404 | `base`가 저장소 이름과 일치하는지 |
| install 단계에서 실패 | `site/pnpm-lock.yaml`이 최신인지 (`cd site && pnpm install` 후 커밋) |
| 빌드 단계에서 실패 | 로컬에서 `cd site && pnpm build`가 통과하는지. 미등록 `[[용어]]`는 빌드를 실패시킨다 |
