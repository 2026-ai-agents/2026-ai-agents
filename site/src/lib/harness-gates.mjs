/**
 * 하네스 게이트 네 개 — day-01의 결정적 방어 코드를 브라우저로 옮긴 것.
 *
 * 원본은 `day-01` 저장소의 `examples/06_harness/` 안에 있다. 여기 있는 것은
 * 흉내가 아니라 **같은 규칙**이다. 정규식도, 경로 정규화 순서도, 임계 판정의
 * 부등호도 원본 그대로 옮겼다. 그래서 같은 입력에 같은 답이 나온다.
 * 대조 기록은 `docs/harness-gates-port.md` 참고.
 *
 * LLM이 개입하는 방어(인젝션 대응 같은 것)는 여기 없다. 그쪽은 확률이라
 * 브라우저에서 재현하면 거짓말이 된다. 이 파일에 있는 것은 전부 결정적이다.
 */

/* ---------- 07_path_jail.py ---------- */

export const JAIL = '/app/workspace';

/** pathlib의 `JAIL / requested` — 오른쪽이 절대경로면 왼쪽을 통째로 갈아치운다. */
function join(base, requested) {
  return requested.startsWith('/') ? requested : `${base}/${requested}`;
}

/** pathlib의 `.resolve()` 중 정규화 부분 — `.`과 `..`를 접는다. */
function normalize(path) {
  const parts = [];
  for (const seg of path.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  }
  return '/' + parts.join('/');
}

/** pathlib의 `is_relative_to` — 같은 경로이거나 그 아래여야 한다. */
function isRelativeTo(path, base) {
  return path === base || path.startsWith(base + '/');
}

/**
 * 원본의 safe_path와 같은 판정.
 * 예외를 던지는 대신 결과를 돌려준다 (화면에 둘 다 보여야 하므로).
 */
export function pathJail(requested) {
  const joined = join(JAIL, requested);
  const resolved = normalize(joined);
  const allowed = isRelativeTo(resolved, JAIL);
  return {
    requested,
    joined,
    resolved,
    allowed,
    // 원본은 PermissionError를 던지고, 예제는 타입 이름을 찍는다
    verdict: allowed ? resolved.slice(JAIL.length + 1) || '.' : 'PermissionError',
  };
}

/* ---------- 06_output_filter.py ---------- */

/**
 * 원본 SECRET_PATTERNS 그대로 — **순서까지** 그대로다.
 * 파이썬의 `\b`와 문자클래스는 JS 정규식에서도 같은 뜻이다.
 */
export const SECRET_PATTERNS = [
  [/sk-[A-Za-z0-9\-_]{16,}/g, 'OpenAI 계열 키'],
  [/AIza[A-Za-z0-9\-_]{20,}/g, 'Google API 키'],
  [/sk-ant-[A-Za-z0-9\-_]{16,}/g, 'Anthropic 키'],
  [/\b\d{3}-\d{2}-\d{6}\b/g, '주민등록번호 형태'],
];

/**
 * 원본 filter_output과 같은 판정. 패턴을 순서대로 돌며 앞선 것이 이미 가린
 * 자리는 뒤엣것이 다시 볼 수 없는 것까지 같다.
 *
 * 그 순서 때문에 드러나는 성질이 하나 있다. `sk-ant-…`는 두 번째 자리의
 * 좁은 패턴이 보기 전에 첫 자리의 `sk-[A-Za-z0-9\-_]{16,}`에 먼저 걸려서,
 * Anthropic 키가 "OpenAI 계열 키"라는 이름으로 가려진다. 가려진다는 결과는
 * 같고 이름만 어긋난다. 포팅하면서 바로잡고 싶었지만, 규칙이 같아야 이
 * 데모가 원본의 증거가 되므로 순서를 그대로 두었다. 화면에서는 이 성질을
 * 그대로 보여 준다.
 */
export function filterOutput(text) {
  const findings = [];
  let out = text;
  for (const [pattern, label] of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(out)) {
      findings.push(label);
      pattern.lastIndex = 0;
      out = out.replace(pattern, `[${label} — 가림]`);
    }
  }
  // 강조 표시용 — 최종 문자열에서 가림 딱지의 자리를 되찾는다
  const spans = [];
  for (const m of out.matchAll(/\[([^\]]+?) — 가림\]/g)) {
    spans.push({ start: m.index, end: m.index + m[0].length, label: m[1] });
  }
  return { filtered: out, findings, spans };
}

/* ---------- 05_tool_permission.py ---------- */

/** 원본 REGISTRY 그대로. 위험 등급은 도구 정의에 박혀 있다. */
export const REGISTRY = {
  get_exchange_rate: { risk: 'safe', note: '환율 조회' },
  search_places: { risk: 'safe', note: '장소 검색' },
  pay_deposit: { risk: 'dangerous', note: '돈이 나간다' },
  cancel_booking: { risk: 'dangerous', note: '되돌릴 수 없다' },
};

/** 원본 execute와 같은 판정 — 모든 도구 실행이 지나는 단 하나의 관문. */
export function executeTool(name, args, approved = false) {
  const risk = REGISTRY[name].risk;
  if (risk === 'dangerous' && !approved) {
    return { blocked: `${name}은 승인 필요. 사용자에게 확인을 받아라.` };
  }
  return { ok: `${name}(${formatArgs(args)}) 실행됨` };
}

/** 파이썬 dict의 repr을 흉내 — 화면 문구를 원본 출력과 맞추기 위한 것뿐이다. */
function formatArgs(args) {
  const body = Object.entries(args)
    .map(([k, v]) => `'${k}': ${typeof v === 'string' ? `'${v}'` : v}`)
    .join(', ');
  return `{${body}}`;
}

/* ---------- 09_budget_guard.py ---------- */

/** 원본이 시뮬레이션에 쓰는 스텝 비용. 히스토리가 부풀어 계단으로 커진다. */
export const STEP_COSTS = [0.008, 0.012, 0.018, 0.025, 0.034, 0.045];

/**
 * 원본 BudgetGuard의 장부를 한 번에 돌려 스텝별 판정을 남긴다.
 * 부등호(`>=`)와 판정 순서(중단 먼저, 경고 나중)는 원본 그대로다.
 */
export function runBudgetGuard(costs, warnUsd, stopUsd) {
  let spent = 0;
  let warned = false;
  const steps = [];
  for (const cost of costs) {
    spent += cost;
    if (spent >= stopUsd) {
      steps.push({ cost, spent, state: 'stop' });
      return { steps, stopped: true, spent };
    }
    let state = 'go';
    if (spent >= warnUsd && !warned) {
      warned = true;
      state = 'warn';
    }
    steps.push({ cost, spent, state });
  }
  return { steps, stopped: false, spent };
}
