import { buildTree, type Category } from 'stack-site-builder/lib/category-tree';

/**
 * `concepts` 컬렉션의 분류 체계 — 과정을 관통하는 개념을 세 축으로 나눈다:
 * 에이전트 원리(루프·도구·하네스), 그래프와 상태, 멀티 에이전트와 검색.
 *
 * concepts 섹션은 지금 site.ts에서 꺼져 있고 콘텐츠도 없다. 그래도 이 파일은
 * 지워선 안 된다 — 테마의 Glossary 컴포넌트가 섹션 토글과 무관하게 여기를
 * import한다. 개념 문서를 쓰기 시작하면 site.ts의 `concepts`를 켜면 된다.
 */
export const conceptCategories: Category[] = [
  {
    id: 'agent-core',
    label: { ko: '에이전트 원리' },
    description: {
      ko: 'LLM 호출, tool calling, ReAct와 그 너머의 루프, 하네스와 가드레일',
    },
  },
  {
    id: 'graph-state',
    label: { ko: '그래프와 상태' },
    description: {
      ko: 'LangGraph의 State·Node·Edge, checkpointer와 store, interrupt와 time-travel',
    },
  },
  {
    id: 'retrieval-multi',
    label: { ko: '검색과 멀티 에이전트' },
    description: {
      ko: '임베딩·벡터DB, Agentic RAG의 선별과 검증, supervisor와 handoff, MCP',
    },
  },
  {
    id: 'concept-uncategorized',
    label: { ko: '미분류' },
    description: {
      ko: '아직 분류에 들어가지 않은 개념',
    },
  },
];

export const conceptTree = buildTree(conceptCategories);

/** Id of the fallback category that holds concepts without a real category. */
export const UNCATEGORIZED_CONCEPT = 'concept-uncategorized';

/** Resolve a concept's `category` to a real tree id (unknown → uncategorized). */
export const conceptCatOf = (category?: string | null): string =>
  category && conceptTree.map.has(category) ? category : UNCATEGORIZED_CONCEPT;
