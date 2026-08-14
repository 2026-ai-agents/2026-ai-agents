import { buildTree, type Category } from 'stack-site-builder/lib/category-tree';

/**
 * `courses` 컬렉션의 분류 체계 — 과정 구조(3일)를 그대로 따른다.
 * 각 일차의 세션은 에이전트 저장소 하나씩에 대응한다.
 */
export const courseCategories: Category[] = [
  {
    id: 'day-1',
    label: { ko: 'Day 1 · 에이전트 해부' },
    description: {
      ko: 'LLM API의 본질, LiteLLM, tool calling, ReAct와 그 너머의 루프, 하네스 엔지니어링',
    },
  },
  {
    id: 'day-2',
    label: { ko: 'Day 2 · LangGraph 제품 4종' },
    description: {
      ko: '제품형 단일 에이전트 4종: 그래프 기본기, 영속성과 승인, 장기 메모리, Agentic RAG',
    },
  },
  {
    id: 'day-3',
    label: { ko: 'Day 3 · Multi-agent와 MCP' },
    description: {
      ko: 'supervisor와 handoff 패턴, 병렬 코딩 에이전트, MCP 서버로 내어주기',
    },
  },
  {
    id: 'course-uncategorized',
    label: { ko: '미분류' },
    description: {
      ko: '아직 분류에 들어가지 않은 강의',
    },
  },
];

export const courseTree = buildTree(courseCategories);

/** Validation map for content.config.ts (strict category ids at build time). */
export const courseCategoryMap = courseTree.map;

/** Id of the fallback category that holds courses without a real category. */
export const UNCATEGORIZED_COURSE = 'course-uncategorized';

/** Resolve a course's `category` to a real tree id (unknown → uncategorized). */
export const courseCatOf = (category?: string | null): string =>
  category && courseTree.map.has(category) ? category : UNCATEGORIZED_COURSE;
