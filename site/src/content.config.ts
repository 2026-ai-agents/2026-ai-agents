import { defineAasCollections } from 'stack-site-builder/content';
import { categoryMap } from './data/categories';
import { courseCategoryMap } from './data/course-categories';

// 콘텐츠 모델(stacks/articles/courses/slides/pages)은 테마가 정의하고,
// 이 사이트는 카테고리 트리만 공급한다 — 강의 category id는 빌드 시 검증된다.
export const collections = defineAasCollections({
  categoryMap,
  courseCategoryMap,
});
