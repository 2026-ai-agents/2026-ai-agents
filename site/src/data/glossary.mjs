// @ts-check
/**
 * `[[용어]]` 위키링크의 중앙 용어집. 본문 어디서든 `[[llm]]`, `[[react|ReAct]]`처럼
 * 참조하면 빌드 시 해당 항목으로 링크된다. 등록되지 않은 용어는 빌드가
 * 실패한다(의도된 동작). 항목 형태:
 *  - { label, def }              — 정의만 있는 용어 (용어집 페이지에 표시)
 *  - { label, concept: '<slug>' } — 개념 문서로 연결 (concepts 섹션을 켠 뒤)
 *  - { label, article: '<slug>' } — 글로 연결
 *  - { label, href }             — 외부 링크
 */
export const glossary = {
  llm: {
    label: 'LLM',
    def: '대량의 텍스트로 사전학습된 대형 언어 모델. 이 과정에서는 전부 외부 API로 호출하며 로컬 GPU는 쓰지 않는다.',
  },
  agent: {
    label: '에이전트',
    def: '도구를 부를지, 몇 번 부를지, 언제 멈출지를 모델이 스스로 결정하며 목표를 향해 반복하는 시스템. 모델 하나가 아니라 제어 루프·도구·데이터를 조립한 결과물이다.',
  },
  'tool-calling': {
    label: 'Tool calling',
    def: '모델이 "이 함수를 이런 인자로 실행해 달라"는 요청을 구조화된 JSON으로 내놓고, 실행 결과를 다시 받아 답을 잇는 방식. 에이전트가 바깥 세계와 닿는 유일한 통로다.',
  },
  react: {
    label: 'ReAct',
    def: 'reasoning(다음 행동 판단) → action(도구 호출) → observation(결과 관찰)을 종료 조건까지 반복하는 가장 기본적인 에이전트 루프.',
  },
  'plan-execute': {
    label: 'Plan-and-Execute',
    def: '한 스텝씩 더듬는 대신 계획을 먼저 세우고 순차 실행하는 루프. 매 스텝마다 전체 히스토리를 다시 싣지 않아 ReAct보다 싸고 빠르다.',
  },
  reflexion: {
    label: 'Reflexion',
    def: '생성 결과를 평가자가 채점하고, 기준에 미달하면 피드백과 함께 다시 생성하는 루프. 생성과 검증을 분리하는 규율의 기본형이다.',
  },
  rewoo: {
    label: 'ReWOO',
    def: '중간 관찰 없이 계획 한 번으로 도구를 병렬 실행하는 루프. 왕복 횟수를 줄여 토큰을 아끼는 데 특화되어 있다.',
  },
  harness: {
    label: '하네스',
    def: '모델을 감싸는 실행 환경 전체. 시스템 프롬프트, 도구 정의, 컨텍스트 관리, 가드레일, 로깅이 모두 여기 들어간다. 같은 모델도 하네스가 성능을 가른다.',
  },
  'prompt-injection': {
    label: '프롬프트 인젝션',
    def: '입력이나 도구가 물어온 문서에 지시를 심어 모델이 원래 지시를 어기게 만드는 공격. 실질적인 방어는 프롬프트가 아니라 데이터 경계와 좁은 도구 권한에서 나온다.',
  },
  'budget-guard': {
    label: 'Budget guard',
    def: '실행 중 누적 토큰·비용이 상한을 넘으면 경고하거나 중단시키는 장치. 스텝 한도가 루프의 보험이라면 이쪽은 지갑의 보험이다.',
  },
  litellm: {
    label: 'LiteLLM',
    def: '여러 LLM 프로바이더를 하나의 호출 인터페이스로 추상화하는 오픈소스 라이브러리. 모델 문자열만 바꾸면 코드 수정 없이 프로바이더가 교체된다.',
  },
  langgraph: {
    label: 'LangGraph',
    def: '에이전트의 제어 흐름을 State·Node·Edge의 그래프로 선언하는 프레임워크. 손으로 짠 루프를 선언적 구조로 옮기고, 영속성·중단·병렬 실행을 얹는다.',
  },
  checkpointer: {
    label: 'Checkpointer',
    def: 'LangGraph의 단기 기억. thread 단위로 그래프 상태를 저장해 재시작이나 중단 뒤에도 대화가 이어지게 한다.',
  },
  store: {
    label: 'Store',
    def: 'LangGraph의 장기 기억. thread를 넘어 남는 사용자의 취향·사실을 저장하고 검색한다. checkpointer가 한 대화 안의 기억이라면 이쪽은 대화들 사이의 기억이다.',
  },
  interrupt: {
    label: 'Interrupt',
    def: '그래프 실행을 특정 노드 앞에서 멈추고 사람의 승인을 기다리는 장치. 결제·예약 확정처럼 되돌리기 어려운 행동 앞에 둔다.',
  },
  supervisor: {
    label: 'Supervisor 패턴',
    def: '상위 에이전트가 하위 전문 에이전트들에게 일을 배분하고 결과를 모으는 멀티 에이전트 구조. 제어권은 늘 supervisor로 돌아온다.',
  },
  handoff: {
    label: 'Handoff 패턴',
    def: '에이전트가 다른 에이전트에게 제어권 자체를 넘기는 멀티 에이전트 구조. 넘겨받은 쪽이 대화를 이어받고, supervisor로 되돌아오지 않는다.',
  },
  rag: {
    label: 'RAG',
    def: '질문에 관련된 문서를 먼저 검색해 근거로 프롬프트에 넣고 답을 생성하는 패턴. 모델이 학습하지 않은 데이터를 다룰 때의 기본 구조다.',
  },
  'agentic-rag': {
    label: 'Agentic RAG',
    def: '검색을 한 번 하고 끝내는 대신, 에이전트가 검색 조건을 정하고 결과를 평가해 다시 검색할지 판단하는 RAG. 선별과 검증이 루프 안에 들어간다.',
  },
  grounding: {
    label: 'Grounding',
    def: '응답의 각 주장에 원본 근거를 붙이는 것. 근거를 댈 수 없는 내용은 내보내지 않는 것이 검증 단계의 목적이다.',
  },
  embedding: {
    label: '임베딩',
    def: '텍스트 등 데이터를 의미가 보존되는 고정 길이 숫자 벡터로 바꾼 표현. 의미 기반 검색의 기반이 된다.',
  },
  'vector-db': {
    label: '벡터 DB',
    def: '임베딩 벡터를 저장하고 유사도 검색을 제공하는 데이터베이스. 이 과정에서는 Chroma를 rag 컨테이너로 띄운다.',
  },
  mcp: {
    label: 'MCP',
    def: 'Model Context Protocol. 도구와 데이터를 표준 프로토콜로 주고받는 규격이다. 도구를 가져오는 쪽과 우리 에이전트를 도구로 내어주는 쪽 모두 이 과정에서 다룬다.',
  },
  docker: {
    label: 'Docker',
    def: '실행 환경을 이미지로 굳혀 어디서나 같은 결과를 내게 하는 컨테이너 도구. 이 과정의 모든 저장소는 `docker compose up --build` 하나로 뜬다.',
  },
  'release-ladder': {
    label: '릴리즈 사다리',
    def: '저장소마다 v0.1에서 v1.0까지 태그를 밟아 올라가는 진행 방식. 태그 하나가 feature 하나의 완결이고, 어느 단이든 그 시점의 코드로 실행된다.',
  },
};
