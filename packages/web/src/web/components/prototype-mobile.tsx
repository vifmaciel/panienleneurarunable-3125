import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, FlaskConical, ListChecks } from "lucide-react";
import type { PanelCase, Tab } from "../lib/demo-data";

export function EvaluationEnvironment({
  phonePreview,
  children,
}: {
  phonePreview: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(() => window.innerWidth > 760 && !phonePreview);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setOpen(!query.matches && !phonePreview);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [phonePreview]);
  return (
    <details
      className="evaluation-environment"
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>
        <span className="lab-icon">
          <FlaskConical size={18} />
        </span>
        <span className="environment-title">
          <strong>Ambiente de avaliação</strong>
          <small>Exclusivo do protótipo · dados fictícios</small>
        </span>
        <ChevronDown size={17} className="environment-chevron" />
      </summary>
      <div className="evaluation">{children}</div>
    </details>
  );
}

export function ScrollableTabs({ activeTab, children }: { activeTab: Tab; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({
        left: el.scrollLeft > 2,
        right: el.scrollWidth - el.clientWidth - el.scrollLeft > 2,
      });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, []);
  useEffect(() => {
    const el = ref.current;
    const selected = el?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el || !selected) return;
    const area = el.getBoundingClientRect();
    const tab = selected.getBoundingClientRect();
    if (tab.left < area.left) el.scrollLeft -= area.left - tab.left;
    else if (tab.right > area.right) el.scrollLeft += tab.right - area.right;
  }, [activeTab]);
  function scroll(direction: number) {
    const el = ref.current;
    if (el)
      el.scrollBy({
        left: direction * el.clientWidth * 0.7,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  return (
    <div
      className={`tabs-navigation ${edges.left ? "has-left" : ""} ${edges.right ? "has-right" : ""}`}
    >
      <div className="tabs-scroll-frame">
        <div ref={ref} className="tabs" role="tablist" aria-label="Abas do Cliente360">
          {children}
        </div>
        {edges.left && <span className="tabs-fade left" aria-hidden="true" />}
        {edges.right && <span className="tabs-fade right" aria-hidden="true" />}
      </div>
      {(edges.left || edges.right) && (
        <div className="tabs-scroll-hint">
          <span>Deslize para ver as 7 abas</span>
          <div>
            <button
              aria-label="Rolar abas para a esquerda"
              disabled={!edges.left}
              onClick={() => scroll(-1)}
            >
              <ArrowLeft size={15} />
            </button>
            <button
              aria-label="Rolar abas para a direita"
              disabled={!edges.right}
              onClick={() => scroll(1)}
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function NextAction({ data }: { data: PanelCase }) {
  const missing = data.missingFacts;
  const ambiguous = data.ambiguousFacts;
  const defined = missing.length > 0 || ambiguous.length > 0;
  return (
    <section className="next-action" aria-labelledby="next-action-title">
      <span className="next-action-icon">
        <ListChecks size={19} />
      </span>
      <div>
        <h3 id="next-action-title">Próxima ação</h3>
        {!defined ? (
          <p>Próxima ação não definida</p>
        ) : (
          <>
            {ambiguous.length > 0 && (
              <p>
                <strong>Revisar informações ambíguas:</strong>{" "}
                {ambiguous.map((f) => f.label).join("; ")}.
              </p>
            )}
            {missing.length > 0 && (
              <p>
                <strong>Confirmar pendências registradas:</strong> {missing.join("; ")}.
              </p>
            )}
          </>
        )}
        <small>
          {defined
            ? "Derivada das pendências deste exemplo · nenhuma tarefa criada"
            : "Os dados disponíveis não determinam uma ação."}
        </small>
      </div>
    </section>
  );
}
