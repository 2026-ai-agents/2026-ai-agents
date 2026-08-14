import { buildTree, type Category } from 'stack-site-builder/lib/category-tree';

/**
 * `articles` 컬렉션의 분류 체계 — 공지·안내 가이드·강의 노트.
 */
export const articleCategories: Category[] = [
  {
    id: 'notice',
    label: { ko: '공지' },
    description: {
      ko: '과정 운영 관련 공지사항',
    },
  },
  {
    id: 'guide',
    label: { ko: '안내' },
    description: {
      ko: '사전 준비, 저장소 사용법, 재현 방법 등 수업 전후에 참고하는 가이드',
    },
  },
  {
    id: 'lecture-note',
    label: { ko: '강의 노트' },
    description: {
      ko: '세션 진행 후 정리하는 보충 노트와 트러블슈팅',
    },
  },
  {
    id: 'article-uncategorized',
    label: { ko: '미분류' },
    description: {
      ko: '아직 분류에 들어가지 않은 글',
    },
  },
];

export const articleTree = buildTree(articleCategories);

/** Id of the fallback category that holds articles without a real category. */
export const UNCATEGORIZED_ARTICLE = 'article-uncategorized';

/** Resolve an article's `category` to a real tree id (unknown → uncategorized). */
export const articleCatOf = (category?: string | null): string =>
  category && articleTree.map.has(category) ? category : UNCATEGORIZED_ARTICLE;
