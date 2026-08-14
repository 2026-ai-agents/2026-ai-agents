// @ts-check
// 2026 AI Agent 실전 강의 사이트 — 사이트 수준 설정만 두고, 라우트·컴포넌트·
// 마크다운 파이프라인은 전부 stack-site-builder 테마가 제공한다.
// 강의 자료가 한국어 단일 언어이므로 로케일은 ko 하나만 쓴다(루트에서 서빙).
//
// GitHub Pages 프로젝트 사이트로 공개하므로 base 경로 아래 산다.
// 저장소 이름이 바뀌면 아래 `base` 상수도 함께 바꿔야 한다(docs/deployment.md).
import { defineConfig } from 'astro/config';
import aasTheme from 'stack-site-builder';
import { glossary } from './src/data/glossary.mjs';
import { site } from './src/data/site';

const base = '/2026-ai-agents';

// 본문 마크다운의 내부 절대 링크(`[텍스트](/article/…)`)에 base를 붙인다.
// 테마의 위키링크는 상대 경로로 렌더해 base 문제가 없지만, 일반 마크다운
// 링크는 그대로 나가서 프로젝트 사이트에서 404가 된다. 콘텐츠는 base를
// 모른 채 `/article/…`로 쓰고, 접두는 빌드가 책임진다.
// (mdast link/definition 노드만 처리한다 — 본문에 raw HTML <a>는 쓰지 않는다)
function remarkBaseLinks() {
  /** @param {any} node */
  const walk = (node) => {
    if (!node) return;
    if (
      (node.type === 'link' || node.type === 'definition') &&
      typeof node.url === 'string' &&
      node.url.startsWith('/') &&
      !node.url.startsWith('//') &&
      node.url !== base &&
      !node.url.startsWith(`${base}/`)
    ) {
      node.url = base + node.url;
    }
    for (const child of node.children ?? []) walk(child);
  };
  return (/** @type {any} */ tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
  site: 'https://2026-ai-agents.github.io',
  base,

  i18n: {
    locales: ['ko'],
    defaultLocale: 'ko',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // 테마가 자기 remark 플러그인들을 updateConfig로 합치므로, 여기 것과
  // 공존한다 (빌드 후 dist에서 위키링크·베이스 접두를 함께 검증했다).
  markdown: {
    remarkPlugins: [remarkBaseLinks],
  },

  // `sections`는 site.ts에서 선언해 여기로 전달 — 꺼진 섹션은 테마가 라우트
  // 주입을 건너뛰고, site.ts 쪽에서 헤더 내비 항목도 숨긴다.
  integrations: [aasTheme({ glossary, sections: site.sections })],
});
