// 포팅 대조 — site의 판정 모듈과 파이썬 원본에 같은 입력을 먹여 결과를 비교한다.
//   node scripts/harness-gates-compare.mjs scripts/harness-gates-cases.json > js.json
//   python3 scripts/harness-gates-reference.py scripts/harness-gates-cases.json > ref.json
//   diff <(python3 -m json.tool js.json) <(python3 -m json.tool ref.json)
import { readFileSync } from 'node:fs';
import { pathJail, filterOutput, executeTool, runBudgetGuard }
  from '../site/src/lib/harness-gates.mjs';

const c = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const r = (n) => Math.round(n * 1e10) / 1e10;
const out = {
  path: c.paths.map((p) => { const x = pathJail(p);
    return { allowed: x.allowed, resolved: x.resolved, verdict: x.verdict }; }),
  filter: c.texts.map((t) => { const x = filterOutput(t);
    return { filtered: x.filtered, findings: x.findings }; }),
  tool: c.tools.map(([n, a, ap]) => executeTool(n, a, ap)),
  budget: c.budgets.map(([costs, w, s]) => { const x = runBudgetGuard(costs, w, s);
    return { steps: x.steps.map((st) => ({ cost: st.cost, spent: r(st.spent), state: st.state })),
             stopped: x.stopped }; }),
};
process.stdout.write(JSON.stringify(out, null, 1));
