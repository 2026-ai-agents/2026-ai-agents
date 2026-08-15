/**
 * JS 포팅본을 대조군과 같은 형식으로 찍는다.
 *
 *   node scripts/day-03-rules-compare.mjs scripts/day-03-rules-cases.json > js.json
 *   python3 scripts/day-03-rules-reference.py scripts/day-03-rules-cases.json > ref.json
 *   diff js.json ref.json
 */
import { readFileSync } from 'node:fs';
import {
  assignModel, estimateRun, routingPlan, ruleRoute,
} from '../site/src/lib/day-03-rules.mjs';

const ROLES = ['backend', 'frontend', 'tests'];
const cases = JSON.parse(readFileSync(process.argv[2], 'utf-8'));

const out = {
  supervisor: cases.supervisor.map((c) => ruleRoute(c)),
  handoff: cases.handoff.map((c) => {
    const plan = routingPlan({
      desk: c.desk, message: c.message, cameFrom: c.came_from,
      turnHandoffs: c.turn_handoffs, rules: c.rules,
    });
    return { allowed: plan.allowed, must_use_tool: plan.mustUseTool, note: plan.note };
  }),
  cost: cases.cost.map((c) => {
    const tasks = ROLES.map((role, index) => ({
      role, model: assignModel(c.difficulties[index]),
    }));
    const estimate = estimateRun(tasks, c.prompt_chars);
    return {
      per_task: estimate.perTask.map((item) => ({
        cost_usd: item.costUsd, in_tokens: item.inTokens, model: item.model,
        out_tokens: item.outTokens, role: item.role,
      })),
      total_usd: estimate.totalUsd,
    };
  }),
};

// 파이썬 json.dump(sort_keys=True, indent=1)와 같은 모양으로 찍는다
const sortKeys = (value) => {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, sortKeys(value[k])]));
  }
  return value;
};
process.stdout.write(JSON.stringify(sortKeys(out), null, 1));
