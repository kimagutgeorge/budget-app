# PROJECT MEMORY — "Pesa" (working name) budget app
> Single source of truth for decisions. Update the Changelog every session. Paste this file at the start of any new AI chat.

## Vision
Local-first Android budget app. Not category-centric: users model **real things in their life** (Netflix, Salary, Car Loan, Mum, Safaricom) and every one of them eventually produces **transactions**. Everything else is derived.

## Stack (decided)
Nuxt 4 (SPA, ssr:false) + Vue 3 + TypeScript · Capacitor 7 (Android) · Dexie (IndexedDB, local-first) · Pinia (UI state only) · Tailwind · VueUse · Zod · date-fns · motion-v (springs/gestures) · Chart.js later.
Money = **integer minor units** (KES cents). Never floats.

## Core entities (6)
1. Workspace (container) — Personal, Business, Family, Church…
2. Account — where money sits (cash, M-Pesa, bank, savings, credit card, loan, investment)
3. Transaction — income | expense | transfer; supports splits; may reference party + source object
4. FinObject — typed (bill, goal, debt, income_source, expense_category, subscription, investment, merchant, tax, project, custom). Common fields + `props` validated per type with Zod
5. Party — people/organisations (employer, landlord, bank, friend, client)
6. Rule — IF condition THEN categorise/allocate (e.g. income Salary → 10% Emergency Fund)
Tags are global (string[] on everything). Reports/balances/net worth are COMPUTED, never stored.

## Review notes on the original design (my additions)
- Merchant is both a FinObject type and overlaps with Party. Decision: **Party = who you pay/get paid by; Merchant FinObject dropped in v1** (Safaricom = Party; Rule maps Party → Category).
- Transfers are a transaction type (accountId → toAccountId), not income/expense, so net worth stays correct.
- "Nothing stores totals" is fine for v1; add cached monthly rollups only if reports get slow (>10k tx).
- Debt: loan Account holds the balance; Debt FinObject holds terms + generates a repayment schedule → transactions.
- Savings is not an object: Goal → points to Account.

## Structure
app/
  app.vue · layouts/default.vue (animated bottom nav)
  pages/ index(Dashboard) transactions accounts objects debts reports settings
  composables/ useLive, useLedger, useMoney   (one per concern)
  db/ index.ts (Dexie schema) · seed.ts · repos/ (later: one repo per entity — UI never touches Dexie directly)
  types/ index.ts · utils/
  assets/css/main.css (design tokens)
docs/PROJECT_MEMORY.md · capacitor.config.ts · nuxt.config.ts

## Design direction
Cool paper background (#EEF2F6), ink (#0F1B2D), teal primary (#0E7C86), saffron (#F2A93B) reserved for ONE thing: the balance figure. Fonts: Bricolage Grotesque (figures/headings) + Instrument Sans (body). Motion: spring nav pill, number tween on balance, page slide; all respect prefers-reduced-motion. Sentence case, no all-caps labels.

## Roadmap
- [x] M0 Scaffold, schema, ledger math, dashboard, nav
- [ ] M1 Add-transaction sheet (bottom sheet, spring drag), accounts CRUD
- [ ] M2 FinObjects + type schemas (Zod), Parties, Tags
- [ ] M3 Split transactions, Rules engine
- [ ] M4 Bills/Subscriptions → reminders (Capacitor Local Notifications)
- [ ] M5 Goals + funding rules, Debts + schedules
- [ ] M6 Reports (Chart.js), CSV export/backup, biometric lock
- [ ] M7 Workspaces switcher, polish, Play Store build

## Changelog
- Session 1: concept expanded, scaffold created (this file, schema, ledger, dashboard, nav).
