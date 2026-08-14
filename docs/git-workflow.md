# Git 워크플로

이 프로젝트는 **git flow** 기반으로 진행한다. 사람이든 AI든 동일하게 따른다.

## 브랜치 모델

| 브랜치 | 역할 |
| --- | --- |
| `main` | 공개 브랜치: 직접 커밋·머지 금지, release/hotfix를 통해서만 갱신. push되면 GitHub Pages로 배포된다 |
| `develop` | 통합 브랜치: 모든 feature 브랜치의 분기점이자 머지 대상 |
| `feature/<이름>` | 기능·콘텐츠 작업: `develop`에서 분기, `develop`으로 머지 (예: `feature/base_setup`) |
| `release/<버전>` | 릴리스 준비: `develop`에서 분기, `main`과 `develop` 양쪽으로 머지 |
| `hotfix/<이름>` | 긴급 수정: `main`에서 분기, `main`과 `develop` 양쪽으로 머지 |

- 새 작업은 항상 `develop`에서 `feature/*` 브랜치를 만들어 시작한다.
- `main`에는 직접 커밋하지 않는다. PR 대상도 기본적으로 `develop`이다.
- **`main`은 곧 공개 사이트다.** 머지 전에 배포해도 되는 상태인지 확인한다.
  배포 동작은 [deployment.md](deployment.md) 참고

## 커밋 규칙

- **커밋하면서 진행한다.** 작업을 작은 논리 단위로 나누고, 한 단위가 완결되면
  바로 커밋한다. 여러 작업의 변경을 워킹 트리에 쌓아두지 않는다.
- **한 커밋에는 한 가지 주제만 담는다.** 예: 사이트 스캐폴드 / docker 구성 /
  배포 워크플로 추가는 각각 별도 커밋으로 나눈다.
- **커밋 전 검증**: 사이트(`site/`) 변경이 있으면 `cd site && pnpm build &&
  pnpm check`가 통과해야 한다. 렌더링에 영향 주는 변경(표·이스케이프 등)은
  해당 페이지를 열어 눈으로도 확인한다.
- **문서 스타일 검사**: md/mdx를 고쳤으면 `python3 scripts/check-style.py`도
  통과해야 한다. writing-rules 중 기계로 잡히는 항목(`).` 마침표 겹침, 취소선
  위험 물결표, MDX 꺾쇠 링크, 볼드 경계, 줄표)을 검사한다.
- **스테이징 확인**: 커밋 전에 `git status`로 산출물(node_modules, dist 등)이
  섞이지 않았는지 확인한다.

## 커밋 메시지

- 제목은 **영어 명령형 한 줄**:
  `Add lecture site under site/ (stack-site-builder based)`
- 필요하면 빈 줄 뒤 본문에 이유·맥락을 적는다. 제목만으로 충분하면 생략한다.

## 릴리스

1. `develop`에서 `release/<버전>` 분기
2. `CHANGELOG.md`와 `site/package.json`의 버전을 올린다
3. `main`으로 머지 → GitHub Pages 배포가 자동으로 돈다
4. `main`에 `vX.Y.Z` 태그를 달고 `develop`으로 역머지

에이전트 저장소들의 `v0.1\~v1.0` 릴리즈 사다리는 이 저장소의 버전과 무관하다.
이 저장소의 버전은 강의 자료의 버전이다.
