export type LinkState = "LINKED" | "NOT_LINKED" | "AMBIGUOUS" | "UNAVAILABLE";
export type Availability = "AVAILABLE" | "NOT_FOUND" | "AMBIGUOUS" | "UNKNOWN";
export type ScreenState = "LOADING" | "EMPTY" | "SUCCESS" | "PARTIAL" | "ERROR" | "STALE";
export type Tab =
  | "Resumo"
  | "Conversa"
  | "Dados"
  | "Pessoas"
  | "Histórico"
  | "Orçamentos"
  | "Automação";
export const tabs: Tab[] = [
  "Resumo",
  "Conversa",
  "Dados",
  "Pessoas",
  "Histórico",
  "Orçamentos",
  "Automação",
];
export const screenLabels: Record<ScreenState, string> = {
  LOADING: "Carregando",
  EMPTY: "Sem dados",
  SUCCESS: "Carregado",
  PARTIAL: "Parcial",
  ERROR: "Erro",
  STALE: "Desatualizado",
};
export const availabilityLabels: Record<Availability, string> = {
  AVAILABLE: "Disponível no exemplo",
  NOT_FOUND: "Não encontrado",
  AMBIGUOUS: "Exige revisão",
  UNKNOWN: "Disponibilidade desconhecida",
};
export const linkLabels: Record<LinkState, string> = {
  LINKED: "Conversa vinculada",
  NOT_LINKED: "Sem conversa vinculada",
  AMBIGUOUS: "Vínculo em revisão",
  UNAVAILABLE: "Conversa indisponível",
};
export interface PanelCase {
  id: string;
  title: string;
  facts: { label: string; value: string; source: string }[];
  people: { id: string; name: string; role: string; initials: string; detail: string }[];
  horus: { availability: Availability; summary: string; source: string };
  missingFacts: string[];
  ambiguousFacts: { label: string; values: string[]; source: string }[];
  quote: {
    availability: Availability;
    items: { id: string; name: string; status: string; price: string; detail: string }[];
  };
  bot: { availability: Availability; name: string; status: string; steps: string[] };
  conversation: {
    state: LinkState;
    availability: Availability;
    provider: string | null;
    accountId: string | null;
    conversationId: string | null;
    caseId: string | null;
    url: string | null;
    evidence: string;
    candidates: string[];
    messages: { author: string; text: string; time: string; outgoing: boolean }[];
  };
  timeline: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    type: "conversation" | "quote" | "data";
    source: string;
  }[];
}
export interface Scenario {
  key: string;
  label: string;
  short: string;
  description: string;
  screen: ScreenState;
  data: PanelCase;
}
const base: PanelCase = {
  id: "NC-2048",
  title: "Aurora Ateliê Criativo",
  facts: [
    { label: "Razão social", value: "Aurora Ateliê Criativo Ltda.", source: "empresa" },
    { label: "CNPJ ilustrativo", value: "00.000.000/0000-00", source: "empresa" },
    { label: "Localização", value: "Campinas · SP", source: "empresa" },
    {
      label: "Interesse comercial",
      value: "Plano de saúde empresarial",
      source: "historico_comercial",
    },
    { label: "Vidas informadas", value: "8 pessoas", source: "core.pessoas" },
    { label: "Etapa registrada", value: "Em cotação", source: "historico_comercial" },
    { label: "Contato de referência", value: "Marina Valença", source: "core.pessoas" },
    { label: "E-mail fictício", value: "marina@aurora.example", source: "empresa" },
  ],
  people: [
    {
      id: "P-01",
      name: "Marina Valença",
      role: "Contato comercial",
      initials: "MV",
      detail: "Responsável administrativa · marina@aurora.example",
    },
    {
      id: "P-02",
      name: "Caio Nobre",
      role: "Sócio",
      initials: "CN",
      detail: "Pessoa relacionada ao cadastro da empresa",
    },
    {
      id: "P-03",
      name: "Lia Faria",
      role: "Colaboradora",
      initials: "LF",
      detail: "Pessoa relacionada · faixa etária não informada",
    },
  ],
  horus: {
    availability: "AVAILABLE",
    summary:
      "Interesse em cobertura regional para a equipe. Há preferência por rede em Campinas, ainda sem confirmação de acomodação.",
    source: "historico_comercial",
  },
  missingFacts: ["Faixas etárias das 8 vidas", "Preferência de acomodação"],
  ambiguousFacts: [],
  quote: {
    availability: "AVAILABLE",
    items: [
      {
        id: "COT-014",
        name: "Horizonte Saúde",
        status: "Rascunho",
        price: "R$ 2.480,00",
        detail: "Empresarial · cobertura regional · 8 vidas",
      },
      {
        id: "COT-015",
        name: "Vereda Assistência",
        status: "Em análise",
        price: "R$ 2.760,00",
        detail: "Empresarial · cobertura regional · 8 vidas",
      },
    ],
  },
  bot: {
    availability: "AVAILABLE",
    name: "Acompanhamento comercial",
    status: "Pausada no exemplo",
    steps: ["Identificação do caso", "Revisão das informações", "Acompanhamento do atendimento"],
  },
  conversation: {
    state: "LINKED",
    availability: "AVAILABLE",
    provider: "Chatwoot",
    accountId: "demo-01",
    conversationId: "1042",
    caseId: "NC-2048",
    url: "/simulacao/chatwoot/demo-01/1042",
    evidence:
      "Referência explícita de channel_history associada ao caso NC-2048. Provedor, conta e conversa correspondem à URL local.",
    candidates: [],
    messages: [
      {
        author: "Marina Valença",
        text: "Olá, Júlia! Estamos buscando um plano de saúde para as 8 pessoas da equipe.",
        time: "09:32",
        outgoing: false,
      },
      {
        author: "Júlia · corretora fictícia",
        text: "Olá, Marina! Vocês têm preferência por uma rede em Campinas?",
        time: "09:35",
        outgoing: true,
      },
      {
        author: "Marina Valença",
        text: "Sim, uma cobertura regional faz sentido. Vou confirmar as idades com a equipe.",
        time: "09:38",
        outgoing: false,
      },
      {
        author: "Júlia · corretora fictícia",
        text: "Combinado. Deixei essa informação pendente no cadastro para a nossa próxima conversa.",
        time: "09:41",
        outgoing: true,
      },
    ],
  },
  timeline: [
    {
      id: "T-03",
      title: "Preferência de cobertura registrada",
      description: "Marina indicou interesse em rede regional. Faixas etárias ainda pendentes.",
      date: "30 out. 2026",
      time: "09:41",
      type: "conversation",
      source: "channel_history",
    },
    {
      id: "T-02",
      title: "Duas cotações em rascunho",
      description: "Exemplos de Horizonte Saúde e Vereda Assistência adicionados ao histórico.",
      date: "29 out. 2026",
      time: "15:20",
      type: "quote",
      source: "historico_comercial",
    },
    {
      id: "T-01",
      title: "Cadastro comercial criado",
      description: "Empresa e contato de referência registrados no caso fictício.",
      date: "28 out. 2026",
      time: "11:08",
      type: "data",
      source: "empresa",
    },
  ],
};
function copy(): PanelCase {
  return structuredClone(base);
}
const b = copy();
b.id = "NC-2049";
b.title = "Brisa Oficina de Ideias";
b.facts[0]!.value = "Brisa Oficina de Ideias Ltda.";
b.facts[7]!.value = "marina@brisa.example";
b.people[0]!.detail = "Contato administrativo · marina@brisa.example";
b.conversation = {
  ...b.conversation,
  state: "NOT_LINKED",
  availability: "NOT_FOUND",
  provider: null,
  accountId: null,
  conversationId: null,
  caseId: null,
  url: null,
  evidence:
    "Não há referência comercial confiável em channel_history. Nome, e-mail ou telefone não são usados para criar um vínculo.",
  messages: [],
};
b.timeline = b.timeline.filter((e) => e.type !== "conversation");
b.quote = { availability: "NOT_FOUND", items: [] };
const c = copy();
c.id = "NC-2050";
c.title = "Estúdio Lume Inventivo";
c.facts[0]!.value = "Estúdio Lume Inventivo Ltda.";
c.facts[7]!.value = "marina@lume.example";
c.people[0]!.detail = "Contato administrativo · marina@lume.example";
c.conversation = {
  ...c.conversation,
  state: "AMBIGUOUS",
  availability: "AMBIGUOUS",
  caseId: null,
  conversationId: null,
  url: null,
  evidence:
    "Duas referências comerciais conflitantes foram encontradas. Nenhuma foi selecionada automaticamente.",
  candidates: [
    "Chatwoot · conta demo-01 · conversa #1081",
    "Chatwoot · conta demo-02 · conversa #1087",
  ],
  messages: [],
};
c.ambiguousFacts = [
  {
    label: "Quantidade de vidas",
    values: ["8 · empresa", "10 · historico_comercial"],
    source: "empresa / historico_comercial",
  },
];
c.quote = { availability: "AMBIGUOUS", items: [] };
c.timeline = c.timeline.filter((e) => e.type !== "conversation");
const d = copy();
d.conversation = {
  ...d.conversation,
  state: "UNAVAILABLE",
  availability: "UNKNOWN",
  provider: null,
  accountId: null,
  conversationId: null,
  caseId: null,
  url: null,
  evidence:
    "Não foi possível obter os dados de channel_history. Isso não comprova ausência de vínculo.",
  messages: [],
};
d.horus.availability = "UNKNOWN";
d.bot.availability = "UNKNOWN";
d.quote = { availability: "UNKNOWN", items: [] };
d.timeline = [];
d.people = [];
d.facts = [];
d.missingFacts = [];
const e = copy();
e.people = e.people.slice(0, 1);
e.facts = e.facts.filter((f) => f.source !== "core.pessoas");
e.quote = { availability: "UNKNOWN", items: [] };
e.bot.availability = "UNKNOWN";
e.missingFacts = [
  "Pessoas: carregamento parcial",
  "Cotações: disponibilidade não confirmada",
  "Preferência de acomodação",
];
const f = structuredClone(d);
export const scenarios: Scenario[] = [
  {
    key: "A",
    label: "A · Empresa vinculada ao Chatwoot",
    short: "Empresa vinculada",
    description: "Vínculo explícito e referência local válida.",
    screen: "SUCCESS",
    data: base,
  },
  {
    key: "B",
    label: "B · Sem conversa vinculada",
    short: "Sem vínculo",
    description: "Nenhuma associação comercial confiável.",
    screen: "SUCCESS",
    data: b,
  },
  {
    key: "C",
    label: "C · Mais de uma associação possível",
    short: "Associação ambígua",
    description: "Referências conflitantes. Revisão necessária.",
    screen: "SUCCESS",
    data: c,
  },
  {
    key: "D",
    label: "D · Dados indisponíveis",
    short: "Dados indisponíveis",
    description: "A disponibilidade do canal não pode ser confirmada.",
    screen: "PARTIAL",
    data: d,
  },
  {
    key: "E",
    label: "E · Informações parcialmente carregadas",
    short: "Carregamento parcial",
    description: "Cadastro e conversa disponíveis; outros módulos incompletos.",
    screen: "PARTIAL",
    data: e,
  },
  {
    key: "F",
    label: "F · Erro de carregamento",
    short: "Erro de carregamento",
    description: "Falha simulada, sem requisição a serviços.",
    screen: "ERROR",
    data: f,
  },
];
export function validConversation(p: PanelCase): boolean {
  const c = p.conversation;
  return (
    c.state === "LINKED" &&
    c.availability === "AVAILABLE" &&
    c.provider === "Chatwoot" &&
    !!c.accountId &&
    !!c.conversationId &&
    c.caseId === p.id &&
    c.url ===
      `/simulacao/chatwoot/${encodeURIComponent(c.accountId)}/${encodeURIComponent(c.conversationId)}`
  );
}
