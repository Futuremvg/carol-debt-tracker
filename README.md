# Carol Debt Tracker

Ferramenta interna da MV Group para acompanhamento de dívidas e planejamento de quitação.

## Stack
- React + TypeScript + Vite
- Tailwind + shadcn/ui

## Executar local
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Qualidade
```bash
npm run lint
```

## Estrutura principal
- `src/pages/VehicleCarolFinancials.tsx` — visão principal financeira
- `src/components/vehicle/` — cards e tabelas de simulação
- `src/utils/carLoanCalculations.ts` — regras de cálculo
- `src/types/vehicleCarol.ts` — tipos de domínio

## Próximas melhorias recomendadas
1. Persistência de dados (localStorage/API)
2. Testes para cálculos financeiros (unitários)
3. Code-splitting para reduzir bundle inicial
4. CI simples (lint + build) no GitHub Actions
