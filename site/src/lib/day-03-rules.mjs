/**
 * Day 3 세 저장소의 **결정적 규칙**만 옮긴 모듈.
 *
 * 사이트는 GitHub Pages라 파이썬을 돌릴 수 없다. 그런데 아래 셋은 모델을
 * 부르지 않고 코드만으로 답이 정해지는 부분이라, 규칙을 그대로 옮기면
 * 브라우저에서 도는 것이 원본의 흉내가 아니라 **원본과 같은 판정**이 된다.
 *
 *   ① 하이브리드 라우팅   energy-agent  `_rule_route` · `wants_chart`
 *   ② 라우팅 기준 셋      support-agent `_routing_plan` · `topics_in`
 *   ③ 비용 추정과 게이트  coding-agent  `estimate_run` · `assign_model`
 *
 * 옮기지 않은 것: LLM이 정하는 자리. energy-agent에서 규칙이 `null`을
 * 돌려주면 그다음은 모델의 판단이고, 그 판단은 실행마다 흔들린다(교안이
 * 정확히 그것을 재고 있다). 브라우저에서 재현하면 "언제나 이렇게 간다"는
 * 거짓 확신을 준다. 그래서 이 도구들은 **규칙이 끝내는 자리까지만** 보여주고,
 * 그 너머는 "여기부터는 LLM"이라고 표시한다.
 *
 * 대조 기록: docs/day-03-rules-port.md
 */

// ─────────────────────────────────────────────────────────────
// ① energy-agent — 하이브리드 라우팅 (app/agent/graph.py)
// ─────────────────────────────────────────────────────────────

export const CHART_WORDS = ['그래프', '차트', '그림', '추이', '시각', '보여'];

/** 원본: `any(word in question for word in CHART_WORDS)` */
export function wantsChart(question) {
  return CHART_WORDS.some((word) => question.includes(word));
}

export const SUPERVISOR_AGENTS = {
  analyst: '분석 담당',
  visualizer: '시각화 담당',
  counselor: '상담 담당',
  done: '종료',
};

/**
 * 원본 `_rule_route`. 코드로 확정할 수 있는 결정만 돌려준다.
 * 규칙이 정하지 못하면 null이고, 그 자리는 LLM이 맡는다.
 */
export function ruleRoute({ question, findings = [], answer = '', hybrid = true }) {
  if (!hybrid) return null;
  const done = new Set(findings);
  if (answer) return { next: 'done', why: '규칙: 답변이 나왔다' };
  if (!done.has('analyst')) return { next: 'analyst', why: '규칙: 자료가 없으면 분석부터' };
  if (wantsChart(question) && !done.has('visualizer')) {
    return { next: 'visualizer', why: '규칙: 그래프를 명시적으로 요청했다' };
  }
  return null;
}

/**
 * 한 질문이 규칙만으로 어디까지 가는지 따라가 본다. 규칙이 멈추는 지점이
 * 곧 LLM이 처음 판단하는 지점이다. 교안의 트레이스와 같은 모양으로 돌려준다.
 */
export function traceSupervisor(question, { hybrid = true } = {}) {
  const steps = [];
  const findings = [];
  let answer = '';

  for (let round = 0; round < 6; round += 1) {
    const decided = ruleRoute({ question, findings, answer, hybrid });
    if (!decided) {
      steps.push({ by: 'llm', next: '?', why: '규칙이 정하지 못한다. 여기부터는 LLM의 판단' });
      break;
    }
    steps.push({ by: 'rule', next: decided.next, why: decided.why });
    if (decided.next === 'done') break;
    findings.push(decided.next);
    if (decided.next === 'counselor') answer = '(답변)';
  }
  return steps;
}

// ─────────────────────────────────────────────────────────────
// ② support-agent — 라우팅 기준 셋 (app/agent/graph.py)
// ─────────────────────────────────────────────────────────────

export const TOPIC_WORDS = {
  billing: ['요금', '청구', '금액', '초과', '로밍', '할인', '납부', '미납', '결제'],
  tech: ['인터넷', '안 돼', '안돼', '안 되', '끊', '속도', '느리', '먹통', '장애',
    '공유기', '와이파이', '데이터가'],
  retention: ['해지', '위약금', '약정', '번호이동', '탈퇴', '옮기'],
};

/** 원본: 낱말이 하나라도 들어 있으면 그 갈래로 친다. */
export function topicsIn(text) {
  return Object.entries(TOPIC_WORDS)
    .filter(([, words]) => words.some((word) => text.includes(word)))
    .map(([name]) => name);
}

export const DESK_LABELS = {
  triage: '접수 상담원',
  billing: '요금 담당',
  tech: '기술지원 담당',
  retention: '해지방어 담당',
};

export const HANDOFF_TARGETS = {
  transfer_to_billing: 'billing',
  transfer_to_tech: 'tech',
  transfer_to_retention: 'retention',
};

export const HANDOFFS_ALLOWED = {
  triage: ['transfer_to_billing', 'transfer_to_tech', 'transfer_to_retention'],
  billing: ['transfer_to_tech', 'transfer_to_retention'],
  tech: ['transfer_to_billing', 'transfer_to_retention'],
  retention: ['transfer_to_billing', 'transfer_to_tech'],
};

export const MAX_HANDOFFS = 3;

/** 원본 `_routing_plan`. (넘길 수 있는 곳, 반드시 도구를 부를 것인가, 규칙 메모) */
export function routingPlan({ desk, message, cameFrom = '', turnHandoffs = 0, rules = true }) {
  const allowed = [...HANDOFFS_ALLOWED[desk]];
  if (turnHandoffs >= MAX_HANDOFFS) {
    return { allowed: [], mustUseTool: false, note: '한 턴 이양 상한' };
  }
  if (!rules) return { allowed, mustUseTool: false, note: '' };

  let note = '';
  const back = Object.keys(HANDOFF_TARGETS).find((key) => HANDOFF_TARGETS[key] === cameFrom);
  if (back && allowed.includes(back)) {
    allowed.splice(allowed.indexOf(back), 1);
    note = `규칙: ${DESK_LABELS[cameFrom]}에게 되돌리지 않는다`;
  }

  if (desk === 'triage' && topicsIn(message).length >= 2) {
    return { allowed: [], mustUseTool: true, note: '규칙: 문의가 둘 이상이라 되묻는다' };
  }

  return { allowed, mustUseTool: desk === 'triage', note };
}

// ─────────────────────────────────────────────────────────────
// ③ coding-agent — 비용 추정과 게이트 (app/agent/cost.py · graph.py)
// ─────────────────────────────────────────────────────────────

export const EXPECTED_OUT_TOKENS = { backend: 1500, frontend: 1800, tests: 1000, planner: 600 };

/**
 * litellm 가격표에서 뽑은 값(1M 토큰당 달러). 원본은 `cost_per_token`을
 * 부르고, 여기서는 그 함수가 돌려주는 것과 같은 단가를 박아 둔다.
 * 다시 확인하는 법은 포팅 기록 문서에 적어 두었다.
 */
export const PRICES = {
  'gemini/gemini-3.5-flash': { input: 1.5, output: 9.0 },
  'gemini/gemini-3.5-flash-lite': { input: 0.3, output: 2.5 },
};

export const TIER_MODEL = {
  strong: 'gemini/gemini-3.5-flash',
  cheap: 'gemini/gemini-3.5-flash-lite',
};

/** 원본 `assign_model`: 난이도가 모델을 고른다. */
export function assignModel(difficulty) {
  return difficulty === 'hard' ? TIER_MODEL.strong : TIER_MODEL.cheap;
}

/** 원본 `estimate_call`: 한글은 대략 두 글자 한 토큰으로 잡는다. */
export function estimateCall(model, role, promptChars) {
  const inTokens = Math.max(200, Math.floor(promptChars / 2));
  const outTokens = EXPECTED_OUT_TOKENS[role] ?? 1000;
  const price = PRICES[model];
  const cost = price
    ? (inTokens * price.input) / 1e6 + (outTokens * price.output) / 1e6
    : 0;
  return { role, model, inTokens, outTokens, costUsd: round6(cost) };
}

/** 원본 `estimate_run`. */
export function estimateRun(tasks, promptChars) {
  const perTask = tasks.map((task) => estimateCall(task.model, task.role, promptChars));
  return {
    perTask,
    totalUsd: round6(perTask.reduce((sum, item) => sum + item.costUsd, 0)),
  };
}

/** 게이트의 판정: 상한 이내면 조용히 지나가고, 넘으면 사람 앞에 선다. */
export function gateDecision(totalUsd, budgetUsd) {
  return totalUsd <= budgetUsd
    ? { asks: false, label: '문은 열려 있다', why: '추정이 상한 이내라 묻지 않는다' }
    : { asks: true, label: '사람에게 묻는다', why: '추정이 상한을 넘어 승인 없이는 한 줄도 짜지 않는다' };
}

function round6(value) {
  return Math.round(value * 1e6) / 1e6;
}
