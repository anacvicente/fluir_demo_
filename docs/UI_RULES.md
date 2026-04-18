
---

## `UI_RULES.md`

```md
# UI_RULES

Este documento define as regras de interface e design system para orientar a IA na construção de telas e componentes.

## Objetivo
Garantir consistência visual, reaproveitamento de componentes e redução de ambiguidade na geração de interface.

## Princípios de UI
1. Consistência antes de criatividade
2. Reutilização antes de criação
3. Clareza antes de densidade
4. Hierarquia visual evidente
5. Estados de interação sempre previstos
6. Acessibilidade como padrão

## A IA deve sempre verificar
- já existe componente semelhante?
- já existe padrão de espaçamento?
- já existe padrão de tipografia?
- já existe padrão para feedback visual?
- já existe padrão para formulários?
- já existe padrão de responsividade?

## Tokens visuais
Substitua pelos tokens reais do projeto quando existirem.

### Espaçamento
- `xs`
- `sm`
- `md`
- `lg`
- `xl`

### Borda e raio
- `radius-sm`
- `radius-md`
- `radius-lg`

### Tipografia
- `text-xs`
- `text-sm`
- `text-base`
- `text-lg`
- `text-xl`

### Peso
- `font-regular`
- `font-medium`
- `font-semibold`
- `font-bold`

## Componentes-base esperados
A IA deve priorizar o uso de componentes já existentes, como:

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Modal
- Drawer
- Card
- Badge
- Alert
- Tooltip
- Table
- Tabs
- Empty State
- Loading State

## Estados obrigatórios
Todo componente de interação deve considerar, quando aplicável:
- default
- hover
- focus
- active
- disabled
- loading
- error
- success

## Formulários
Regras:
1. Labels sempre claros
2. Erros próximos ao campo
3. Placeholder não substitui label
4. Campos obrigatórios devem ser identificáveis
5. Agrupar campos relacionados
6. Manter consistência de largura e alinhamento

## Feedback visual
Sempre prever:
- loading
- erro
- sucesso
- vazio
- ausência de permissão
- ausência de dados

## Tabelas e listas
A IA deve:
- priorizar legibilidade
- evitar poluição visual
- manter alinhamento consistente
- tratar estados vazios
- prever responsividade

## Hierarquia visual
A interface deve deixar claro:
- título da página
- objetivo principal
- ação principal
- ações secundárias
- conteúdo principal
- feedbacks do sistema

## Responsividade
Ao criar ou alterar UI:
- considerar desktop primeiro, se este for o padrão do projeto
- adaptar para tablet e mobile quando aplicável
- evitar quebra de layout
- evitar overflow desnecessário
- tratar tabelas e formulários em telas menores

## Acessibilidade
A IA deve considerar:
- contraste suficiente
- foco visível
- labels associados
- botões com texto compreensível
- ícones não dependerem sozinhos de significado
- navegação utilizável por teclado quando aplicável

## Regra para criação de novos componentes
Só criar novo componente quando:
1. não existir equivalente
2. não for possível compor com os existentes
3. houver ganho real de reutilização

Se criar novo componente, manter:
- naming consistente
- props previsíveis
- API simples
- estilo alinhado ao design system

## Prompt recomendado para tarefas de UI
"Use os componentes existentes e siga UI_RULES.md. Antes de criar qualquer componente novo, verifique se já existe equivalente ou se a composição com os componentes atuais resolve a necessidade."