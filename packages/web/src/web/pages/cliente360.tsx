import { useEffect, useRef, useState, type ReactNode } from "react";
import { EvaluationEnvironment, NextAction, ScrollableTabs } from "../components/prototype-mobile";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  CheckCheck,
  ChevronRight,
  CircleHelp,
  Clock3,
  Database,
  FileText,
  FlaskConical,
  Info,
  LayoutDashboard,
  Link2,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
  MessageSquare,
  Monitor,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TriangleAlert,
  Unplug,
  Users,
  Workflow,
  X,
  XCircle,
} from "lucide-react";
import {
  availabilityLabels,
  linkLabels,
  scenarios,
  screenLabels,
  tabs,
  validConversation,
  type Availability,
  type PanelCase,
  type ScreenState,
  type Tab,
} from "../lib/demo-data";

const tabIcons = {
  Resumo: LayoutDashboard,
  Conversa: MessageSquare,
  Dados: Database,
  Pessoas: Users,
  Histórico: Clock3,
  Orçamentos: FileText,
  Automação: Workflow,
};
function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={`logo ${small ? "small" : ""}`}>
      <svg width="30" height="32" viewBox="0 0 30 32" fill="none" aria-hidden="true">
        <path
          d="M3 25V7l7 4v18L3 25Zm10-5V2l7 4v18l-7-4Zm10 5V7l5 3v18l-5-3Z"
          fill="currentColor"
        />
      </svg>
      <span>
        NEURA<span className="logo-dot">.</span>
      </span>
    </div>
  );
}
function Badge({
  children,
  tone = "neutral",
  icon = true,
}: {
  children: ReactNode;
  tone?: string;
  icon?: boolean;
}) {
  const Icon =
    tone === "green" ? Check : tone === "amber" ? TriangleAlert : tone === "red" ? XCircle : Info;
  return (
    <span className={`badge ${tone}`}>
      {icon && <Icon size={12} strokeWidth={2.4} />}
      {children}
    </span>
  );
}
function AvailabilityBadge({ value }: { value: Availability }) {
  return (
    <Badge tone={value === "AVAILABLE" ? "green" : value === "AMBIGUOUS" ? "amber" : "neutral"}>
      {availabilityLabels[value]}
    </Badge>
  );
}
function Panel({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  icon?: typeof Info;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-head">
        <div>
          <h3>
            {Icon && <Icon size={18} />} {title}
          </h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
function EmptyModule({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-module">
      <Database size={25} />
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}

function ConversationCard({
  data,
  open,
  allowed,
  full = false,
}: {
  data: PanelCase;
  open: () => void;
  allowed: boolean;
  full?: boolean;
}) {
  const c = data.conversation;
  const tone = c.state === "LINKED" ? "green" : c.state === "AMBIGUOUS" ? "amber" : "neutral";
  return (
    <Panel
      title={full ? "Vínculo da conversa" : "Conversa do cliente"}
      icon={MessageSquare}
      className="conversation-card"
    >
      <Badge tone={tone}>{linkLabels[c.state]}</Badge>
      <p className="conversation-explain">
        {c.state === "LINKED"
          ? "A referência comercial deste caso corresponde a uma conversa identificada."
          : c.evidence}
      </p>
      {c.state === "LINKED" && (
        <div className="channel-ref">
          <span className="channel-icon">
            <MessageSquare size={18} />
          </span>
          <div>
            <strong>
              {c.provider} <span className="muted">· simulação</span>
            </strong>
            <span>
              Conversa #{c.conversationId} · conta {c.accountId}
            </span>
          </div>
          <ShieldCheck size={18} className="green-text" />
        </div>
      )}
      <button className="button primary full" disabled={!allowed} onClick={open}>
        <MessageSquare size={17} />
        Abrir conversa
        <ArrowUpRight size={17} />
      </button>
      <p className="micro centered">
        {allowed
          ? "Abre uma simulação local. Nenhuma mensagem será enviada."
          : "Abertura bloqueada: é necessário vínculo explícito e URL válida."}
      </p>
      {full && (
        <>
          <div className="divider" />
          <dl className="details">
            <div>
              <dt>Estado de vínculo</dt>
              <dd>
                <code>{c.state}</code>
              </dd>
            </div>
            <div>
              <dt>Disponibilidade</dt>
              <dd>
                <code>{c.availability}</code>
              </dd>
            </div>
            <div>
              <dt>Provedor</dt>
              <dd>{c.provider ?? "Não confirmado"}</dd>
            </div>
            <div>
              <dt>Identificador do caso</dt>
              <dd>{c.caseId ?? "Não confirmado"}</dd>
            </div>
            <div>
              <dt>Conta / conversa</dt>
              <dd>
                {c.accountId && c.conversationId
                  ? `${c.accountId} / ${c.conversationId}`
                  : "Não confirmado"}
              </dd>
            </div>
            <div>
              <dt>URL local correspondente</dt>
              <dd>
                <code className="url-code">{c.url ?? "Não disponível"}</code>
              </dd>
            </div>
          </dl>
          <div className="notice green">
            <ShieldCheck size={19} />
            <div>
              <strong>Evidência do vínculo</strong>
              <p>{c.evidence}</p>
            </div>
          </div>
        </>
      )}
      {c.candidates.length > 0 && (
        <div className="candidates">
          <h4>Referências para revisão</h4>
          {c.candidates.map((x) => (
            <div key={x}>
              <Link2 size={16} />
              {x}
              <LockKeyhole size={14} />
            </div>
          ))}
          <p className="micro">A seleção manual não é operacional neste protótipo.</p>
        </div>
      )}
    </Panel>
  );
}

function Timeline({ data, compact = false }: { data: PanelCase; compact?: boolean }) {
  return (
    <div className="timeline">
      {data.timeline.length ? (
        data.timeline.slice(0, compact ? 2 : undefined).map((e, i) => {
          const Icon =
            e.type === "conversation" ? MessageSquare : e.type === "quote" ? FileText : Building2;
          return (
            <div className="timeline-item" key={e.id}>
              <div className={`timeline-icon ${i === 0 ? "highlight" : ""}`}>
                <Icon size={16} />
              </div>
              <div className="timeline-body">
                <div className="timeline-meta">
                  {e.date}
                  <span>· {e.time}</span>
                </div>
                <h4>{e.title}</h4>
                <p>{e.description}</p>
                {!compact && <span className="source">Fonte fictícia: {e.source}</span>}
              </div>
            </div>
          );
        })
      ) : (
        <EmptyModule
          title="Histórico não disponível"
          text="Nenhuma interação pode ser apresentada com os dados deste cenário."
        />
      )}
    </div>
  );
}
function Facts({ data, compact = false }: { data: PanelCase; compact?: boolean }) {
  const selected = compact
    ? data.facts.filter((f) =>
        ["Interesse comercial", "Vidas informadas", "Localização", "Etapa registrada"].includes(
          f.label,
        ),
      )
    : data.facts;
  return selected.length ? (
    <dl className={`facts ${compact ? "facts-summary" : ""}`}>
      {selected.map((f) => (
        <div key={f.label}>
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
          {!compact && <span className="source">{f.source}</span>}
        </div>
      ))}
    </dl>
  ) : (
    <EmptyModule
      title="Cadastro indisponível"
      text="Não foi possível confirmar as informações cadastrais deste cenário."
    />
  );
}

function Content({
  tab,
  data,
  open,
  allowed,
  navigate,
}: {
  tab: Tab;
  data: PanelCase;
  open: () => void;
  allowed: boolean;
  navigate: (tab: Tab) => void;
}) {
  if (tab === "Resumo")
    return (
      <div className="content-grid">
        <NextAction data={data} />
        <div className="main-column">
          <Panel
            title="O cliente em um olhar"
            subtitle="Informações comerciais reunidas neste caso."
            action={
              <span className="icon-tile">
                <Building2 size={20} />
              </span>
            }
          >
            <Facts data={data} compact />
            <div className="panel-foot">
              <span>
                <Database size={14} />
                Fontes locais do cadastro comercial
              </span>
              <button className="text-button" onClick={() => navigate("Dados")}>
                Ver todos os dados
                <ArrowRight size={14} />
              </button>
            </div>
          </Panel>
          <Panel
            title="Pontos de atenção"
            icon={ListChecks}
            action={
              <span className="counter">
                {data.missingFacts.length + data.ambiguousFacts.length}
              </span>
            }
          >
            {data.missingFacts.length === 0 && data.ambiguousFacts.length === 0 ? (
              <p className="muted">
                Não há pendências confirmadas neste conjunto de dados. Isso não indica um cadastro
                completo.
              </p>
            ) : (
              <div className="attention-list">
                {data.missingFacts.map((x) => (
                  <div key={x}>
                    <span className="attention-icon">
                      <Info size={16} />
                    </span>
                    <div>
                      <strong>{x}</strong>
                      <span>Informação ainda não confirmada</span>
                    </div>
                    <Badge tone="amber" icon={false}>
                      Pendente
                    </Badge>
                  </div>
                ))}
                {data.ambiguousFacts.map((x) => (
                  <div key={x.label}>
                    <TriangleAlert size={19} className="amber-text" />
                    <div>
                      <strong>{x.label}</strong>
                      <span>Fontes apresentam valores diferentes</span>
                    </div>
                    <Badge tone="amber" icon={false}>
                      Revisar
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <div className="subtle-note">
              Pendências são informativas, não novos campos obrigatórios.
            </div>
          </Panel>
          <Panel
            title="Últimas movimentações"
            icon={Clock3}
            action={
              <button className="text-button" onClick={() => navigate("Histórico")}>
                Ver histórico
                <ArrowRight size={14} />
              </button>
            }
          >
            <Timeline data={data} compact />
          </Panel>
        </div>
        <div className="context-column">
          <ConversationCard data={data} open={open} allowed={allowed} />
          <Panel title="Contexto comercial" icon={Sparkles}>
            <div className="eyebrow">HORUS · VISÃO INFORMATIVA</div>
            {data.horus.availability === "AVAILABLE" ? (
              <p className="context-summary">{data.horus.summary}</p>
            ) : (
              <p className="muted">Contexto não confirmado neste cenário.</p>
            )}
            <span className="source">Fonte fictícia: {data.horus.source}</span>
          </Panel>
          <Panel title="Módulos do caso">
            <button className="module-row" onClick={() => navigate("Orçamentos")}>
              <span className="icon-tile">
                <FileText size={18} />
              </span>
              <span>
                <strong>Orçamentos</strong>
                <small>
                  {data.quote.items.length
                    ? `${data.quote.items.length} cotações ilustrativas`
                    : availabilityLabels[data.quote.availability]}
                </small>
              </span>
              <ChevronRight size={17} />
            </button>
            <button className="module-row" onClick={() => navigate("Automação")}>
              <span className="icon-tile">
                <Workflow size={18} />
              </span>
              <span>
                <strong>Automação</strong>
                <small>Somente visualização</small>
              </span>
              <ChevronRight size={17} />
            </button>
          </Panel>
        </div>
      </div>
    );
  if (tab === "Conversa")
    return (
      <div className="content-grid">
        <ConversationCard data={data} open={open} allowed={allowed} full />
        <div className="context-column">
          <Panel title="Identidade antes de acesso" icon={ShieldCheck}>
            <p className="context-summary">
              Vínculo comercial é diferente de semelhança de contato.
            </p>
            <div className="check-list">
              <p>
                <Check size={17} />
                Provedor e identificadores explícitos
              </p>
              <p>
                <Check size={17} />
                Referência correspondente ao caso
              </p>
              <p>
                <Check size={17} />
                URL correspondente à conversa
              </p>
              <p>
                <X size={17} />
                Nome ou telefone, isoladamente
              </p>
            </div>
            <div className="subtle-note">
              Chatwoot é apenas o provedor representado no exemplo. Nenhum serviço externo é
              acessado.
            </div>
          </Panel>
          <Panel title="Disponibilidade do canal">
            <AvailabilityBadge value={data.conversation.availability} />
            <p className="context-summary">
              O estado de disponibilidade não substitui a verificação do vínculo.
            </p>
          </Panel>
        </div>
      </div>
    );
  if (tab === "Dados")
    return (
      <div className="content-grid">
        <Panel
          title="Dados cadastrais e comerciais"
          subtitle="Valores fictícios conforme as fontes do modelo existente."
          icon={Database}
        >
          <Facts data={data} />
        </Panel>
        <div className="context-column">
          <Panel title="Informações faltantes" icon={Info}>
            {data.missingFacts.map((x) => (
              <div className="simple-row" key={x}>
                <span>{x}</span>
                <Badge tone="amber" icon={false}>
                  Não informado
                </Badge>
              </div>
            ))}
            {!data.missingFacts.length && (
              <p className="muted">Sem pendências confirmadas no exemplo.</p>
            )}
            <p className="micro">Nenhum campo é tratado como obrigatório.</p>
          </Panel>
          <Panel title="Informações ambíguas" icon={TriangleAlert}>
            {data.ambiguousFacts.length ? (
              data.ambiguousFacts.map((x) => (
                <div className="ambiguity" key={x.label}>
                  <h4>{x.label}</h4>
                  {x.values.map((v) => (
                    <p key={v}>{v}</p>
                  ))}
                  <Badge tone="amber">Revisão necessária</Badge>
                </div>
              ))
            ) : (
              <p className="muted">Nenhum conflito identificado nos dados disponíveis.</p>
            )}
          </Panel>
        </div>
      </div>
    );
  if (tab === "Pessoas")
    return (
      <Panel
        title="Pessoas relacionadas"
        subtitle="Pessoas representadas no modelo · fonte fictícia core.pessoas"
        icon={Users}
        action={<span className="counter">{data.people.length}</span>}
      >
        <div className="people-list">
          {data.people.map((p) => (
            <article className="person" key={p.id}>
              <span className="avatar">{p.initials}</span>
              <div>
                <h4>{p.name}</h4>
                <p>{p.detail}</p>
                <span className="source">Referência {p.id} · core.pessoas</span>
              </div>
              <Badge icon={false}>{p.role}</Badge>
            </article>
          ))}
        </div>
        {!data.people.length && (
          <EmptyModule
            title="Pessoas indisponíveis"
            text="Não há registros utilizáveis neste cenário."
          />
        )}
        <div className="subtle-note">
          Pessoas relacionadas não representam automaticamente beneficiários ou vínculos de
          conversa. A quantidade de registros exibidos não é a quantidade de vidas informadas.
        </div>
      </Panel>
    );
  if (tab === "Histórico")
    return (
      <Panel
        title="Histórico comercial"
        subtitle="Linha do tempo fictícia · eventos em ordem mais recente"
        icon={Clock3}
      >
        <Timeline data={data} />
        <div className="subtle-note">
          Registros locais de empresa, historico_comercial e channel_history. Nenhuma interação foi
          executada pelo protótipo.
        </div>
      </Panel>
    );
  if (tab === "Orçamentos")
    return (
      <>
        <div className="notice neutral">
          <Info size={20} />
          <div>
            <strong>Cotações, não apólices</strong>
            <p>
              Valores e operadoras inteiramente fictícios. Sem cálculo real, envio de proposta ou
              contratação.
            </p>
          </div>
        </div>
        <Panel
          title="Cotações do caso"
          subtitle="Representação visual do campo quote."
          icon={FileText}
          action={<AvailabilityBadge value={data.quote.availability} />}
        >
          <div className="quote-list">
            {data.quote.items.map((q, i) => (
              <article className="quote" key={q.id}>
                <div className="quote-top">
                  <span className="quote-logo">{i === 0 ? "H" : "V"}</span>
                  <div>
                    <span className="eyebrow">{q.id} · EXEMPLO LOCAL</span>
                    <h4>{q.name}</h4>
                  </div>
                  <Badge tone={i ? "amber" : "neutral"} icon={false}>
                    {q.status}
                  </Badge>
                </div>
                <p>{q.detail}</p>
                <div className="quote-price">
                  <strong>{q.price}</strong>
                  <span>/ mês · valor ilustrativo</span>
                </div>
                <div className="subtle-note">
                  <LockKeyhole size={14} />
                  Cotação não operacional · sem proposta ou contratação
                </div>
              </article>
            ))}
          </div>
          {!data.quote.items.length && (
            <EmptyModule
              title={availabilityLabels[data.quote.availability]}
              text={
                data.quote.availability === "NOT_FOUND"
                  ? "Nenhuma cotação registrada neste exemplo."
                  : "Não há cotação confiável para apresentar neste cenário."
              }
            />
          )}
        </Panel>
      </>
    );
  return (
    <>
      <div className="notice neutral">
        <LockKeyhole size={20} />
        <div>
          <strong>Visualização, não execução</strong>
          <p>
            O módulo existente está representado apenas para avaliação de UX. Não há disparos,
            envios ou ações operacionais.
          </p>
        </div>
      </div>
      <div className="content-grid">
        <Panel
          title="Automação do caso"
          subtitle="Representação do campo bot do PanelCase."
          icon={Workflow}
          action={<AvailabilityBadge value={data.bot.availability} />}
        >
          <div className="automation-title">
            <span className="icon-tile">
              <Workflow size={24} />
            </span>
            <div>
              <h4>{data.bot.name}</h4>
              <p>
                {data.bot.availability === "AVAILABLE" ? data.bot.status : "Estado não confirmado"}
              </p>
            </div>
          </div>
          <div className="workflow">
            {data.bot.steps.map((s, i) => (
              <div key={s}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{s}</strong>
                  <p>Etapa ilustrativa · sem execução</p>
                </div>
                <LockKeyhole size={16} />
              </div>
            ))}
          </div>
          <div className="subtle-note">Controles de ativação não fazem parte deste protótipo.</div>
        </Panel>
        <Panel title="Limites deste exemplo" icon={ShieldCheck}>
          <div className="check-list">
            <p>
              <LockKeyhole size={17} />
              Sem conexão com WhatsApp
            </p>
            <p>
              <LockKeyhole size={17} />
              Sem envio de mensagens
            </p>
            <p>
              <LockKeyhole size={17} />
              Sem processamento em segundo plano
            </p>
            <p>
              <LockKeyhole size={17} />
              Sem alteração do sistema original
            </p>
          </div>
        </Panel>
      </div>
    </>
  );
}

function Modal({
  children,
  title,
  close,
  kind = "",
}: {
  children: ReactNode;
  title: string;
  close: () => void;
  kind?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const old = document.activeElement as HTMLElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.showModal();
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const nodes = ref.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input, [tabindex="0"]',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", key);
      old?.focus();
    };
  }, [close]);
  return (
    <dialog className={`modal ${kind}`} ref={ref} aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-header">
        <div>
          <span className="eyebrow">NEURA · PROTÓTIPO LOCAL</span>
          <h2 id="modal-title">{title}</h2>
        </div>
        <button className="icon-button" onClick={close} aria-label="Fechar simulação">
          <X size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export default function Cliente360() {
  const [key, setKey] = useState("A");
  const [tab, setTab] = useState<Tab>("Resumo");
  const [state, setState] = useState<ScreenState>("SUCCESS");
  const [mobile, setMobile] = useState(false);
  const [modal, setModal] = useState<"conversation" | "guide" | null>(null);
  const [historyFilter, setHistoryFilter] = useState("");
  const scenario = scenarios.find((s) => s.key === key)!;
  const data = scenario.data;
  const usable = !["LOADING", "EMPTY", "ERROR"].includes(state);
  const allowed = usable && validConversation(data);
  function changeScenario(value: string) {
    const s = scenarios.find((s) => s.key === value)!;
    setKey(value);
    setState(s.screen);
    setModal(null);
    setHistoryFilter("");
  }
  function navigate(next: Tab) {
    setTab(next);
    setHistoryFilter("");
  }
  const close = useRef(() => setModal(null)).current;
  const filtered = historyFilter
    ? {
        ...data,
        timeline: data.timeline.filter((e) =>
          `${e.title} ${e.description} ${e.source}`
            .toLocaleLowerCase("pt-BR")
            .includes(historyFilter.toLocaleLowerCase("pt-BR")),
        ),
      }
    : data;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <div className="workspace-label">
          ESPAÇO COMERCIAL<span>Seu atendimento, em contexto.</span>
        </div>
        <div className="sidebar-section">ÁREA DE TRABALHO</div>
        <button className="sidebar-active" onClick={() => navigate("Resumo")}>
          <LayoutDashboard size={19} />
          Cliente360
          <span className="sidebar-active-dot" />
        </button>
        <div className="sidebar-case">
          <span className="eyebrow">CASO EM VISUALIZAÇÃO</span>
          <div className="sidebar-company">
            <Building2 size={20} />
            <strong>{data.title}</strong>
          </div>
          <span>{data.id} · dados fictícios</span>
        </div>
        <div className="sidebar-bottom">
          <div className="local-note">
            <span className="local-dot" />
            <div>
              <strong>Ambiente de avaliação</strong>
              <p>Dados locais. Sem integrações.</p>
            </div>
          </div>
          <button onClick={() => setModal("guide")}>
            <CircleHelp size={18} />
            Guia do protótipo
            <ArrowUpRight size={15} />
          </button>
          <div className="profile">
            <span className="avatar">JA</span>
            <div>
              <strong>Júlia Andrade</strong>
              <p>Corretora fictícia</p>
            </div>
            <span className="profile-dot" />
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="mobile-logo">
              <Logo small />
            </span>
            <span className="desktop-crumb">
              Comercial
              <ChevronRight size={14} />
            </span>
            <strong>Cliente360</strong>
          </div>
          <div className="topbar-right">
            <span className="prototype-pill">
              <FlaskConical size={14} />
              Protótipo UX
            </span>
            <div className="view-switch" aria-label="Visualização">
              <button
                className={!mobile ? "selected" : ""}
                onClick={() => setMobile(false)}
                aria-label="Visualização desktop"
                aria-pressed={!mobile}
              >
                <Monitor size={16} />
                <span>Desktop</span>
              </button>
              <button
                className={mobile ? "selected" : ""}
                onClick={() => setMobile(true)}
                aria-label="Visualização celular"
                aria-pressed={mobile}
              >
                <Smartphone size={16} />
                <span>Celular</span>
              </button>
            </div>
            <button
              className="mobile-guide icon-button"
              aria-label="Guia do protótipo"
              onClick={() => setModal("guide")}
            >
              <CircleHelp size={20} />
            </button>
          </div>
        </header>
        <main className={`workspace ${mobile ? "phone-preview" : ""}`}>
          <div className="canvas">
            <EvaluationEnvironment phonePreview={mobile}>
              <div className="evaluation-controls">
                <label>
                  <span>Cenário de avaliação</span>
                  <select
                    aria-label="Cenário de avaliação"
                    value={key}
                    onChange={(e) => changeScenario(e.target.value)}
                  >
                    {scenarios.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="screen-select">
                  <span>Estado da tela</span>
                  <select
                    aria-label="Estado da tela"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value as ScreenState);
                      setModal(null);
                    }}
                  >
                    {Object.entries(screenLabels).map(([v, label]) => (
                      <option key={v} value={v}>
                        {label} · {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </EvaluationEnvironment>
            <div className="page-heading">
              <div>
                <div className="eyebrow">RELACIONAMENTO COMERCIAL</div>
                <h1>
                  Cliente360<span className="heading-dot">.</span>
                </h1>
                <p>O contexto certo para cada conversa.</p>
              </div>
              <span className="page-date">
                <Clock3 size={14} />
                30 out. 2026 · exemplo
              </span>
            </div>
            <section className="client-header" aria-label="Identificação do cliente">
              <div className="client-identity">
                <div className="company-avatar">
                  {key === "B" ? "BO" : key === "C" ? "LI" : "AC"}
                  <span>
                    <Building2 size={13} />
                  </span>
                </div>
                <div>
                  <div className="client-name">
                    <h2>{data.title}</h2>
                    <Badge icon={false}>Empresa fictícia</Badge>
                  </div>
                  <p>
                    <span>{data.id}</span>
                    <span className="dot-separator">·</span>
                    {usable
                      ? "Plano de saúde empresarial"
                      : "Contexto do cenário · dados não carregados"}
                  </p>
                  {usable && data.facts.length > 0 && (
                    <div className="client-meta">
                      <span>
                        <Users size={14} />
                        Marina Valença
                      </span>
                      <span>
                        <Building2 size={14} />
                        Campinas · SP
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="identity-status">
                <Badge
                  tone={
                    !usable
                      ? "neutral"
                      : data.conversation.state === "LINKED"
                        ? "green"
                        : data.conversation.state === "AMBIGUOUS"
                          ? "amber"
                          : "neutral"
                  }
                >
                  {!usable
                    ? "Identidade não confirmada"
                    : data.conversation.state === "LINKED"
                      ? "Vínculo identificado"
                      : data.conversation.state === "AMBIGUOUS"
                        ? "Identidade em revisão"
                        : "Sem vínculo confirmado"}
                </Badge>
                <span>
                  {usable && data.conversation.state === "LINKED"
                    ? "Referência explícita do caso"
                    : "Nenhuma associação automática"}
                </span>
              </div>
            </section>
            <ScrollableTabs activeTab={tab}>
              {tabs.map((t) => {
                const Icon = tabIcons[t];
                return (
                  <button
                    key={t}
                    role="tab"
                    id={`tab-${t}`}
                    aria-controls="tab-content"
                    aria-selected={tab === t}
                    tabIndex={tab === t ? 0 : -1}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        const next = tabs[(tabs.indexOf(t) + (e.key === "ArrowRight" ? 1 : 6)) % 7];
                        navigate(next);
                        document.getElementById(`tab-${next}`)?.focus();
                        document
                          .getElementById(`tab-${next}`)
                          ?.scrollIntoView({ block: "nearest", inline: "nearest" });
                      }
                    }}
                    className={tab === t ? "active" : ""}
                    onClick={() => navigate(t)}
                  >
                    <Icon size={17} />
                    {t}
                    {t === "Orçamentos" && data.quote.items.length > 0 && usable && (
                      <span className="tab-count">{data.quote.items.length}</span>
                    )}
                  </button>
                );
              })}
            </ScrollableTabs>
            <div className="section-intro">
              <div>
                <h2>
                  {tab === "Resumo"
                    ? "Visão geral do cliente"
                    : tab === "Conversa"
                      ? "Conversa e identidade"
                      : tab === "Dados"
                        ? "Informações do cliente"
                        : tab === "Pessoas"
                          ? "Quem faz parte deste caso"
                          : tab === "Histórico"
                            ? "Cada interação, em contexto"
                            : tab === "Orçamentos"
                              ? "Visão das cotações"
                              : "Visão da automação"}
                </h2>
                <p>
                  {tab === "Resumo"
                    ? "O que sabemos, o que falta e os próximos pontos de atenção."
                    : "Informações ilustrativas do modelo existente, sem ações operacionais."}
                </p>
              </div>
              <Badge
                tone={
                  state === "ERROR"
                    ? "red"
                    : state === "PARTIAL" || state === "STALE"
                      ? "amber"
                      : state === "SUCCESS"
                        ? "green"
                        : "neutral"
                }
              >
                {screenLabels[state]}
              </Badge>
            </div>
            <div
              id="tab-content"
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
              className="tab-content"
              key={`${key}-${tab}-${state}`}
            >
              {state === "LOADING" ? (
                <div aria-live="polite" className="loading-state">
                  <div className="loading-caption">
                    <LoaderCircle size={19} />
                    <span>
                      Carregando exemplo visual… <code>LOADING</code>
                    </span>
                  </div>
                  <div className="skeleton-grid">
                    <div className="skeleton-panel">
                      <div />
                      <div />
                      <div />
                      <div />
                    </div>
                    <div className="skeleton-panel">
                      <div />
                      <div />
                      <div />
                    </div>
                  </div>
                  <p className="micro">
                    Estado fixo para avaliação. Escolha outro estado no seletor para continuar.
                  </p>
                </div>
              ) : state === "EMPTY" || state === "ERROR" ? (
                <div className={`screen-empty ${state === "ERROR" ? "error" : ""}`}>
                  <span className="state-icon">
                    {state === "ERROR" ? <Unplug size={32} /> : <Search size={32} />}
                  </span>
                  <span className="eyebrow">{state}</span>
                  <h3>
                    {state === "ERROR"
                      ? "Não foi possível carregar este caso"
                      : "Nenhum dado para apresentar"}
                  </h3>
                  <p>
                    {state === "ERROR"
                      ? "Falha simulada de carregamento. Não há informações confiáveis para exibir nesta aba e a conversa permanece bloqueada."
                      : "Este exemplo representa um retorno vazio. Nenhuma conversa, pessoa ou cotação foi confirmada."}
                  </p>
                  <button className="button primary" onClick={() => changeScenario("A")}>
                    Voltar ao cenário A<ArrowRight size={17} />
                  </button>
                  <span className="micro">
                    Ação local: troca o cenário, sem consultar serviços.
                  </span>
                </div>
              ) : (
                <>
                  {(state === "PARTIAL" || state === "STALE") && (
                    <div className="notice amber" aria-live="polite">
                      <TriangleAlert size={20} />
                      <div>
                        <strong>
                          {state === "PARTIAL"
                            ? "Algumas informações não puderam ser confirmadas"
                            : "Você está vendo uma cópia desatualizada"}
                        </strong>
                        <p>
                          {state === "PARTIAL"
                            ? scenario.description +
                              " Os dados disponíveis continuam visíveis; ausência não significa inexistência."
                            : "Cópia fictícia de 28 out. 2026, 11:08. O vínculo mostrado pertence a essa cópia e não comprova a situação atual."}
                        </p>
                      </div>
                      <code>{state}</code>
                    </div>
                  )}
                  {tab === "Histórico" && (
                    <label className="history-search">
                      <Search size={17} />
                      <input
                        aria-label="Filtrar histórico"
                        value={historyFilter}
                        onChange={(e) => setHistoryFilter(e.target.value)}
                        placeholder="Buscar no histórico deste caso"
                      />
                      {historyFilter && (
                        <button
                          className="icon-button"
                          aria-label="Limpar busca"
                          onClick={() => setHistoryFilter("")}
                        >
                          <X size={15} />
                        </button>
                      )}
                    </label>
                  )}
                  <Content
                    tab={tab}
                    data={filtered}
                    open={() => {
                      if (allowed) setModal("conversation");
                    }}
                    allowed={allowed}
                    navigate={navigate}
                  />
                </>
              )}
            </div>
            <footer className="page-footer">
              <span>
                <ShieldCheck size={14} />
                Protótipo de UX · informações inteiramente fictícias
              </span>
              <span>
                NEURA / Cliente360 <span className="footer-version">v0.1</span>
              </span>
            </footer>
          </div>
        </main>
      </div>
      {modal === "conversation" && allowed && (
        <Modal title="Conversa do cliente" close={close} kind="chat-modal">
          <div className="chat-identity">
            <span className="avatar">MV</span>
            <div>
              <strong>Marina Valença</strong>
              <p>
                {data.title} · conversa #{data.conversation.conversationId}
              </p>
            </div>
            <Badge tone="green">Simulação local</Badge>
          </div>
          <div className="chat-date">30 de outubro de 2026 · mensagens fictícias</div>
          <div className="messages">
            {data.conversation.messages.map((m, i) => (
              <div className={`message ${m.outgoing ? "outgoing" : ""}`} key={i}>
                <strong>{m.author}</strong>
                <p>{m.text}</p>
                <span>
                  {m.time}
                  {m.outgoing && <CheckCheck size={14} />}
                </span>
              </div>
            ))}
          </div>
          <div className="chat-locked">
            <LockKeyhole size={17} />
            <span>Somente leitura. Envio de mensagens não disponível.</span>
          </div>
          <div className="chat-reference">
            <code>{data.conversation.url}</code>
            <span>Provedor representado: Chatwoot · sem conexão externa</span>
          </div>
        </Modal>
      )}
      {modal === "guide" && (
        <Modal title="Um espaço para avaliar a experiência" close={close}>
          <div className="guide-content">
            <p>
              Este protótipo visual preserva as sete abas do Cliente360. Todos os clientes,
              contatos, operadoras, valores e mensagens são fictícios.
            </p>
            <h3>Como explorar</h3>
            <ol>
              <li>Escolha um dos cenários A–F no topo.</li>
              <li>Alterne o estado geral da tela para avaliar falhas, vazio e carregamento.</li>
              <li>Navegue nas sete abas. No cenário A, abra a conversa local.</li>
              <li>Use Celular para uma prévia estreita ou abra em seu próprio dispositivo.</li>
            </ol>
            <div className="notice neutral">
              <ShieldCheck size={20} />
              <p>
                Sem APIs, banco, WhatsApp ou Chatwoot real. Sem envio, cálculo, contratação ou
                execução de automação. O projeto NEURA original não foi alterado.
              </p>
            </div>
            <h3>Modelo representado</h3>
            <p className="model-keys">
              id · title · facts · people · horus · missingFacts · ambiguousFacts · quote · bot ·
              conversation · timeline
            </p>
            <p className="micro">
              Fontes ilustradas: empresa, core.pessoas, historico_comercial e channel_history.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
