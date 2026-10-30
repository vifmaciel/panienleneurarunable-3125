# Cliente360 — execução

- [x] Plano aprovado: web responsivo em projeto separado, visual próprio sem galeria.
- [x] Template inicializado e design documentado.
- [x] Modelar PanelCase e cenários A–F, estados gerais e disponibilidade.
- [x] Implementar sete abas, controle de cenários e conversa local validada.
- [x] Verificar compilação, navegação, estados e viewport mobile/desktop.
- [x] Entregar protótipo em execução.

Limites: sem geração de mídia, APIs, banco, canais externos, envio ou automações operacionais. Sem alteração do projeto original.

Verificação: build aprovado; lint sem erros; 42 combinações de cenário/aba, seis estados gerais, busca no histórico, modal local e larguras 320/390/768/1440px aprovados. Sem erros de runtime e sem overflow horizontal da página. Screenshots revisadas. Vite em tmux neura-preview, porta 4200.

## Refinamento pontual mobile
- [x] Ambiente de avaliação recolhível, fechado por padrão no celular e na prévia Celular.
- [x] Indicação de rolagem de abas, gradientes laterais e setas; seleção preservada.
- [x] Próxima ação no Resumo derivada apenas de missingFacts/ambiguousFacts, com fallback e sem botão operacional.
- [x] Verificar regressões e layout.
- [ ] Entregar atualização.
Escopo restrito a componentes de interface, CSS e documentação. Nenhuma mudança no PanelCase, cenários, regras de vínculo, backend ou conteúdo das outras abas.

Refinamento validado: build e lint aprovados. Suíte anterior 42 combinações de cenário/aba e seis estados aprovada. Teste mobile adicional confirmou seção fechada em 390px e prévia Celular, abertura dos seletores A–F, rolagem sem mudar seleção, destaque atual, Próxima ação em A/C e fallback em D, ausência fora do Resumo, botão único de conversa e modal somente leitura. Sem overflow em 320/390/768/1440px e sem erros de runtime. Screenshot mobile-refined.png revisada.