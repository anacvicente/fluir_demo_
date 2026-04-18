# ARCHITECTURE

Este documento descreve a arquitetura-base do projeto para orientar implementações com IA.

## Visão geral
O projeto deve ser tratado como uma aplicação modular, com separação clara entre:
- interface
- lógica de negócio
- acesso a dados
- integrações externas
- utilitários compartilhados

## Princípios arquiteturais
1. Separar apresentação de regra de negócio
2. Evitar acoplamento forte entre módulos
3. Priorizar legibilidade e manutenção
4. Reutilizar componentes e funções antes de criar novos
5. Manter responsabilidades bem definidas

## Estrutura sugerida
```text
src/
  app/
  pages/
  components/
    ui/
    forms/
    layout/
    feedback/
  features/
  services/
  hooks/
  lib/
  utils/
  types/
  styles/
docs/
