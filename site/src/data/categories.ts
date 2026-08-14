import { buildTree, type Category } from 'stack-site-builder/lib/category-tree';

export type { Category } from 'stack-site-builder/lib/category-tree';

/**
 * `stacks` 컬렉션(테마 코어 도구 카탈로그)의 분류 체계 — 과정에서 실제로 쓰는
 * "사용 도구" 카탈로그로 활용한다. 홈은 cards 템플릿이라 카탈로그 홈을 거치지
 * 않고, 홈의 "사용 도구" 카드가 부모 카테고리 페이지(`/categories/tools/`)로
 * 연결한다. 이 페이지는 서브트리(실행 환경 + 에이전트 스택)의 도구를 모두 모아
 * 보여준다.
 */
const categories: Category[] = [
  {
    id: 'tools',
    label: { ko: '사용 도구' },
    description: { ko: '과정에서 실제로 쓰는 실행 환경과 에이전트 스택' },
    detail: {
      ko: '모든 저장소는 compose로 뜹니다. 로컬에 Python 환경을 만들 필요가 없고, 여기 모인 도구들은 전부 컨테이너 안에서 돕니다.',
    },
    children: [
      {
        id: 'runtime',
        label: { ko: '실행 환경' },
        description: { ko: '컨테이너와 데이터 저장소. 저장소마다 compose로 함께 뜬다' },
      },
      {
        id: 'agent-stack',
        label: { ko: '에이전트 스택' },
        description: { ko: 'LLM 호출·그래프·검색·UI를 담당하는 파이썬 라이브러리' },
      },
    ],
  },
];

/** Top-level categories (homepage sections), in display order. */
export const rootCategories = categories;

const tree = buildTree(categories);

/** Every node by id (top-level and nested). */
export const categoryMap = tree.map;

/** All category ids, for static path generation. */
export const allCategoryIds = tree.allIds;

/** Root → node chain for an id (its breadcrumb path). Empty if unknown. */
export const pathOf = tree.pathOf;

/** Direct children of a node (empty for leaves). */
export const childrenOf = tree.childrenOf;

/** A node's id plus all of its descendants' ids (for subtree roll-up). */
export const descendantIds = tree.descendantIds;

/** The top-level ancestor id of a node (itself if already top-level). */
export function rootIdOf(id: string): string {
  const path = pathOf(id);
  return path.length ? path[0].id : id;
}
