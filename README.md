# Rogers Neighbourhood Growth Planning Agent

A responsive, boardroom-ready concept demonstration showing how an agentic decision system could combine neighbourhood market, network, commercial, competitive, demographic, and financial signals to recommend where Rogers should build, market, sell, defend, and grow next.

## Local setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The deployable output is written to `dist/`.

## Azure Static Web Apps

1. Connect this GitHub repository to an Azure Static Web Apps resource.
2. Use `npm run build` as the build command.
3. Use `/` as the application location.
4. Use `dist` as the output location.

`public/staticwebapp.config.json` provides SPA route fallback so direct navigation and refresh work on every route.

## Demo walkthrough

Start with **Executive Walkthrough** in the top bar. The ten-step story explains the fragmented growth-planning challenge, signal detection, Brookfield North prioritization, specialist-agent analysis, scenario comparison, recommendation, human approval, cross-functional planning, and outcome measurement.

The primary interactive journey is:

1. Explore the **Growth Signal Radar**.
2. Select Brookfield North on the **Market Opportunity Map**.
3. Inspect evidence in **Neighbourhood Deep Dive**.
4. Run the six-agent analysis in **Agent Recommendation**.
5. Change financial assumptions and compare four scenarios.
6. Approve the recommendation for planning.
7. Open the generated **Growth Plan** and **Business Outcomes Centre**.

## Architecture

The demonstration is a static React and TypeScript application built with Vite, Tailwind CSS, Recharts, Lucide React, and React Router. It requires no backend, database, authentication, API keys, or secrets. All data and calculations are deterministic and stored locally.

The architecture page illustrates a potential Microsoft implementation using Azure Static Web Apps, Microsoft Fabric and OneLake, Azure Machine Learning, Microsoft Foundry, Azure OpenAI, Azure integration services, and Microsoft security and governance controls. All Rogers integrations shown are proposed only.

## Synthetic-data disclaimer

Concept demonstration using synthetic neighbourhood, customer, network, demographic, competitive, financial, and market data. Recommendations, financial values, coverage information, forecasts, and agent actions are simulated and are not Rogers forecasts or production decisions.
