# README_AI

Este projeto foi preparado para trabalhar com IA de forma eficiente, reduzindo desperdício de tokens, retrabalho e geração de código desalinhado com a stack.

## Objetivo
A IA deve atuar como copiloto de produto e engenharia, respeitando:
- a arquitetura existente
- os componentes já criados
- as regras visuais
- as restrições técnicas
- o escopo definido para cada tarefa

## Princípios de uso
1. Antes de implementar, a IA deve entender o contexto.
2. A IA deve preferir reutilizar código existente.
3. A IA não deve introduzir dependências sem necessidade clara.
4. A IA deve trabalhar em etapas pequenas.
5. A IA deve propor um plano antes de fazer mudanças grandes.
6. A IA deve explicitar riscos e suposições.
7. A IA deve evitar alterar partes não solicitadas do sistema.

## Ordem ideal de trabalho
Sempre seguir este fluxo:

1. Ler contexto do projeto
2. Ler arquitetura
3. Ler regras de UI
4. Entender a tarefa
5. Propor plano de implementação
6. Implementar por etapas
7. Revisar impactos
8. Sugerir próximos passos

## Como a IA deve responder
Ao receber uma tarefa, a IA deve responder nessa sequência:

### 1. Entendimento
- objetivo da tarefa
- arquivos possivelmente envolvidos
- componentes reutilizáveis
- regras de negócio percebidas
- dúvidas ou riscos

### 2. Plano
- lista curta de etapas
- o que será alterado
- o que não será alterado
- impactos esperados

### 3. Execução
- implementar apenas a etapa pedida
- manter padrão do projeto
- comentar decisões importantes quando necessário

## Restrições importantes
- Não criar novos padrões se já existir um padrão válido no projeto
- Não reescrever arquivos inteiros sem necessidade
- Não criar abstrações excessivas
- Não criar componentes duplicados
- Não alterar naming conventions existentes
- Não mudar arquitetura sem justificar

## Regra de ouro
Mais importante do que gerar muito código é gerar código compatível com o contexto do projeto.

## Prompt base recomendado
Use este comando no início de uma tarefa:

"Considere README_AI.md, ARCHITECTURE.md e UI_RULES.md como fonte da verdade. Primeiro resuma o que entendeu sobre a tarefa, os arquivos envolvidos, os componentes reutilizáveis e os riscos. Não implemente ainda."

## Exemplo de fluxo
### Passo 1
"Leia os arquivos de contexto e me diga como este projeto está estruturado."

### Passo 2
"Com base nesse contexto, proponha um plano para implementar a feature abaixo."

### Passo 3
"Implemente apenas a etapa 1."

### Passo 4
"Revise a implementação e aponte riscos, melhorias e eventuais refactors."
