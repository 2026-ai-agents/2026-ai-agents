#!/usr/bin/env python3
"""문서 스타일 검사 — docs/writing-rules.md 중 기계로 잡을 수 있는 규칙들.

사용법 (repo 루트에서):
    python3 scripts/check-style.py

검사 항목:
  1) `).`     — 닫는 괄호로 끝나는 문장의 마침표 겹침
  2) 취소선   — 한 문단에 이스케이프 안 된 `~` 2개 이상 (GFM 취소선 오발동)
  3) MDX 링크 — .mdx 안의 `<http…>` 꺾쇠 자동 링크 (JSX로 해석되어 빌드 실패)
  4) 볼드 경계 — 닫는 괄호·따옴표 뒤 `**` + 한글 (별표가 그대로 노출)
  5) 줄표(—)  — 한글 문장에서 줄표(em dash)로 구절을 잇는 형태 (표의 빈 칸 마커는 제외)
  6) `]](`    — 위키링크 바로 뒤의 괄호. [[용어]](…)는 마크다운 링크로 파싱되어 위키링크가 깨진다

코드 펜스(``` … ```, mermaid 포함)와 인라인 코드 스팬(`…`)은 검사에서 제외한다.
위반이 있으면 목록을 출력하고 종료 코드 1을 반환한다.
"""

import re
import subprocess
import sys

FENCE_RE = re.compile(r"```.*?```", re.S)
INLINE_CODE_RE = re.compile(r"`[^`\n]*`")

CLOSE_PUNCT = r")\]\"”'』」"

# 표의 빈 칸 마커 `| — |`는 연결자가 아니므로 검사 대상에서 뺀다.
EMDASH_EMPTY_CELL_RE = re.compile(r"(?<=\|)\s*—\s*(?=\|)")

# 외부 원본을 그대로 옮긴 파일 — 우리 스타일 규칙을 적용하지 않는다.
# (원본이 갱신되면 통째로 교체하므로 손대지 않는 것이 규칙이다)
EXCLUDED = {"docs/course-plan.md"}


def tracked_files() -> list[str]:
    out = subprocess.run(
        ["git", "ls-files", "*.md", "*.mdx"], capture_output=True, text=True, check=True
    ).stdout
    return [line for line in out.splitlines() if line and line not in EXCLUDED]


def strip_code(text: str) -> str:
    """코드 펜스·인라인 코드를 같은 줄 수의 공백으로 치환한다 (줄 번호 보존)."""

    def blank(m: re.Match) -> str:
        return re.sub(r"[^\n]", " ", m.group(0))

    return INLINE_CODE_RE.sub(blank, FENCE_RE.sub(blank, text))


def check_file(path: str) -> list[str]:
    raw = open(path, encoding="utf-8").read()
    text = strip_code(raw)
    lines = text.split("\n")
    problems: list[str] = []

    # 1) `).` — 닫는 괄호 바로 뒤 마침표
    for i, line in enumerate(lines, 1):
        if re.search(r"\)\.", line):
            problems.append(f"{path}:{i}: ').' — 괄호로 끝나는 문장에 마침표 겹침")

    # 2) 취소선 위험 — 문단 안에 이스케이프 안 된 ~ 2개 이상
    line_no = 1
    for para in text.split("\n\n"):
        tildes = re.findall(r"(?<!\\)~", para)
        if len(tildes) >= 2:
            problems.append(f"{path}:{line_no}: '~' {len(tildes)}개 — 취소선 위험, `\\~`로 이스케이프")
        line_no += para.count("\n") + 2

    # 3) .mdx 꺾쇠 자동 링크
    if path.endswith(".mdx"):
        for i, line in enumerate(lines, 1):
            if re.search(r"<https?://", line):
                problems.append(f"{path}:{i}: '<http…>' — MDX에서 JSX로 해석됨, [텍스트](URL) 사용")

    # 4) 볼드 경계 — 문장부호와 한글 사이에 낀 `**`
    for i, line in enumerate(lines, 1):
        if re.search(rf"[{CLOSE_PUNCT}]\*\*[가-힣A-Za-z0-9]", line):
            problems.append(f"{path}:{i}: '…)**한글' — 볼드가 닫히지 않음, 문장 다듬기/<strong> 사용")

    # 5) 줄표(—) — 한글 문장에서 줄표로 잇는 형태 (표의 빈 칸 마커 `| — |`는 제외)
    for i, line in enumerate(lines, 1):
        if "—" in EMDASH_EMPTY_CELL_RE.sub("  ", line):
            problems.append(f"{path}:{i}: '—' 줄표 — 문장을 끊거나 리스트·쉼표·콜론·괄호로 바꾼다")

    # 6) `]](` — 위키링크 바로 뒤 괄호는 마크다운 링크로 파싱된다
    for i, line in enumerate(lines, 1):
        if re.search(r"\]\]\(", line):
            problems.append(f"{path}:{i}: ']](' — 위키링크 뒤 괄호가 마크다운 링크로 파싱됨, 문장을 다듬어 띄운다")

    return problems


def main() -> int:
    all_problems: list[str] = []
    for path in tracked_files():
        all_problems.extend(check_file(path))
    if all_problems:
        print("문서 스타일 위반 (docs/writing-rules.md 참고):")
        for p in all_problems:
            print(" -", p)
        return 1
    print("check-style: 위반 없음")
    return 0


if __name__ == "__main__":
    sys.exit(main())
