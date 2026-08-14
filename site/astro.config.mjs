// @ts-check
// 2026 AI Agent 실전 강의 사이트 — 사이트 수준 설정만 두고, 라우트·컴포넌트·
// 마크다운 파이프라인은 전부 stack-site-builder 테마가 제공한다.
// 강의 자료가 한국어 단일 언어이므로 로케일은 ko 하나만 쓴다(루트에서 서빙).
//
// GitHub Pages 프로젝트 사이트로 공개하므로 `/2026-ai-agents/` base 경로 아래
// 산다. 저장소 이름이 바뀌면 base도 함께 바꿔야 한다(배포: docs/deployment.md).
import { defineConfig } from 'astro/config';
import aasTheme from 'stack-site-builder';
import { glossary } from './src/data/glossary.mjs';
import { site } from './src/data/site';

// https://astro.build/config
export default defineConfig({
  site: 'https://2026-ai-agents.github.io',
  base: '/2026-ai-agents',

  i18n: {
    locales: ['ko'],
    defaultLocale: 'ko',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // `sections`는 site.ts에서 선언해 여기로 전달 — 꺼진 섹션은 테마가 라우트
  // 주입을 건너뛰고, site.ts 쪽에서 헤더 내비 항목도 숨긴다.
  integrations: [aasTheme({ glossary, sections: site.sections })],
});
