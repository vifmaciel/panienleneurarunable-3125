# NEURA — Cliente360

Protótipo de avaliação em projeto separado. Interface React web mobile-first, sem consultas a API ou banco. PanelCase e conversas em memória.

## Identidade visual
Branco, verde-petróleo (#123f3b), fundo mineral (#f5f7f7). Verde suave para vínculo comprovado, âmbar para revisão, vermelho para erro. Bordas discretas, raios de 12px, sem gráficos decorativos. Poppins para títulos e corpo, fallback sans-serif. Logo tipográfico com símbolo SVG geométrico.

## Layout
Desktop: lateral de contexto (não novos módulos), cabeçalho, laboratório de cenários, identidade, sete abas e duas colunas de conteúdo. Mobile: sem lateral, controles empilhados, abas com rolagem horizontal, conteúdo em uma coluna. Toque mínimo 44px, texto legível e foco contrastante.

## Fluxos e estados
Cenários A–F e seletor LOADING/EMPTY/SUCCESS/PARTIAL/ERROR/STALE. Vínculo e disponibilidade independentes. Abrir conversa apenas em LINKED+AVAILABLE, com provedor, conta, conversa e URL local correspondentes. Nome e telefone nunca comprovam vínculo. Modal local com Escape, foco contido e retorno de foco, sem envio.

## Escopo e arquivos
Página Cliente360, dados PanelCase locais, CSS global e modal. Abas Resumo, Conversa, Dados, Pessoas, Histórico, Orçamentos, Automação. Sem alterações ao backend ou NEURA original. Fontes fictícias empresa, core.pessoas, historico_comercial, channel_history. Quote é cotação, nunca apólice. Horus e automação são representações informativas, sem execução.

## Refinamento mobile solicitado
Ambiente de avaliação em seção recolhível, fechada no celular e na prévia Celular. Abas com indicação de conteúdo lateral, setas para rolar sem mudar a seleção e destaque preservado. Resumo recebe Próxima ação compacta, exclusivamente derivada de missingFacts e ambiguousFacts, sem prioridade comercial inferida, criação de tarefa ou botão operacional. Ausência de pendências: Próxima ação não definida. Conversa continua primeira no mobile e com um único botão de abertura por tela. Contratos de dados e conteúdo das outras abas intactos.
