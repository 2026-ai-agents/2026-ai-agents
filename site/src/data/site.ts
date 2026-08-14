import type { SectionKey } from 'stack-site-builder';

/**
 * 사이트 정체성 — 테마가 `@aas-data/site` alias로 읽어간다.
 * UI 문자열 오버라이드 키는 테마의 src/i18n/ui.ts와 동일하다.
 */
export const site = {
  /** 헤더와 홈 타이틀에 표시. */
  name: '충남대 AI Agent 실전',
  /** 이 사이트의 소스 저장소 — 헤더의 GitHub 링크가 여기를 가리킨다. */
  repoUrl: 'https://github.com/2026-ai-agents/2026-ai-agents',
  /** 빌드 시 GitHub API 호출(스타 수 등)에 쓰는 User-Agent. */
  buildUserAgent: 'ai-agents-2026-site',
  /** 공개 저장소라 헤더의 GitHub 링크를 노출한다. */
  repoNav: true,
  /**
   * 이 사이트가 제공하는 로케일. 강의 자료가 한국어뿐이라 ko 단일 로케일 —
   * astro.config의 `i18n.defaultLocale`과 첫 항목이 일치해야 한다.
   */
  locales: [{ code: 'ko', label: '한국어', dateLocale: 'ko-KR' }] as {
    code: string;
    label: string;
    dateLocale?: string;
  }[],
  /**
   * 섹션 구성: 강의(courses)·슬라이드(slides)·글(articles)·용어집(glossary)·
   * 소개(pages)를 쓴다.
   * - courses는 opt-in이라 명시적으로 켠다 (src/data/course-categories.ts 필요).
   * - concepts는 개념 문서를 아직 만들지 않아 끈다. 문서가 생기면 여기서 켜고
   *   홈 카드와 src/data/concept-categories.ts를 되살린다.
   * - samples(실행 샘플)는 쓰지 않는다. 실행 가능한 코드는 조직의 에이전트
   *   저장소가 각각 담당한다.
   * - articles/slides/glossary/pages는 기본 on이라 그대로 둔다.
   * - products/papers(논문)는 기본 off(opt-in)라 그대로 둔다.
   * - 도구 카탈로그(stacks)는 테마 코어라 항상 켜져 있고, cards 홈에서
   *   "사용 도구" 카드로 연결한다.
   */
  sections: {
    courses: true,
    concepts: false,
    samples: false,
  } satisfies Partial<Record<SectionKey, boolean>>,
  /**
   * 데이터 주도 cards 홈 — 기본 홈(스택 카탈로그) 대신 강의 사이트에 맞는
   * 히어로 + 바로가기 카드 + CTA 구성을 쓴다. 내부 href는 로케일 프리픽스
   * 없이 쓰면 렌더 시 현재 로케일이 붙는다.
   */
  home: {
    template: 'cards' as const,
    hero: {
      title: 'AI Agent 실전',
      subtitle:
        'LiteLLM · LangGraph · RAG · Multi-agent · MCP<br>3일 12시간, 시연과 코드 리딩으로 보는<br>제품형 에이전트 8종',
    },
    cardsTitle: '바로가기',
    cards: [
      {
        href: '/course/',
        name: '강의',
        description: '일차별 강의 자료 —<br>에이전트 원리부터 멀티 에이전트, MCP까지',
        tags: ['Day 1 원리·하네스', 'Day 2 LangGraph', 'Day 3 Multi-agent'],
      },
      {
        href: '/slides/',
        name: '슬라이드',
        description: '일차별 강의 슬라이드 —<br>브라우저에서 바로 보는 프레젠테이션',
        tags: ['프레젠테이션'],
      },
      {
        href: '/article/',
        name: '글',
        description: '공지사항과 사전 준비 가이드, 강의 노트',
        tags: ['공지', '사전 준비', '강의 노트'],
      },
      {
        href: '/categories/tools/',
        name: '사용 도구',
        description: '과정에서 실제로 쓰는 실행 환경과<br>에이전트 스택 정리',
        tags: ['Docker', 'LiteLLM', 'LangGraph'],
      },
    ],
    cta: {
      title: '수업 전에 준비할 것이 있습니다',
      description: 'API 키 발급과 Docker 셋업까지,<br>사전 준비는 30분이면 끝납니다.',
      button: { label: '사전 준비 가이드', href: '/article/prep-guide/' },
    },
    /**
     * cards 홈에서는 테마의 카탈로그 Browse 내비가 숨겨지므로(테마 1.22.0),
     * 헤더에 "사용 도구" 항목을 추가해 native 도구 카탈로그 페이지로 연결한다.
     * 홈의 "사용 도구" 카드와 같은 곳(/categories/tools/)을 가리킨다.
     */
    browse: { href: '/categories/tools/', label: { ko: '사용 도구' } },
  },
  /** 테마 UI 문자열의 로케일별 오버라이드. */
  ui: {
    ko: {
      'site.tagline':
        'AI Agent 실전 — LiteLLM·LangGraph·RAG·Multi-agent·MCP를 다루는 3일 과정의 강의 자료, 슬라이드, 용어집',
    },
  } as Record<string, Record<string, string>>,
};

export type SiteConfig = typeof site;
