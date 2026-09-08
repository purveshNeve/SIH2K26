# PAIMANA Frontend UX Audit and Redesign Blueprint

## Scope

This audit covers the React + Vite + TypeScript frontend under `frontend/`.
The redesign preserves the existing project, alert, benchmark, simulation, and copilot data contracts. Backend routes, ML calculations, and fallback behavior remain unchanged during the implementation phase.

## 1. Current Product Inventory

### Application shell and routing

| Current route | Current role | Primary implementation | Assessment |
| --- | --- | --- | --- |
| `/login` | Authentication | `src/app/login.tsx`, `src/components/login-form.tsx` | Clear visual entry point, but the product promise is broader than the post-login information architecture. |
| `/dashboard` | Portfolio overview | `src/pages/Dashboard.tsx`, `src/components/dashboard/ExecutiveDashboard.tsx` | Strongest current experience, but too many competing KPI blocks and no explicit attention queue. |
| `/predictions` | Cost and schedule prediction | `src/pages/Predictions.tsx`, `src/components/predictions/*` | Two long technical tools are stacked together; the user must know which model to use before seeing the insight. |
| `/risk` | PCRI risk framework | `src/pages/Risk.tsx`, `src/components/risk/RiskScoringFramework.tsx` | Mixes portfolio comparison, one selected project, and model explanation. It is neither a clean portfolio view nor a project detail view. |
| `/alerts` | Early warnings | `src/pages/Alerts.tsx`, `src/components/alerts/EarlyWarningSystem.tsx` | Useful triage feed, but terminology is operationally dense and status actions are not connected to a durable workflow. |
| `/benchmarking` | Ministry and agency comparison | `src/pages/Benchmarking.tsx`, `src/components/benchmarking/BenchmarkAnalytics.tsx` | Mostly tables; lacks an insight-led comparison narrative and sector comparison. |
| `/cuf` | CUF and SHAP explanation | `src/pages/CUF.tsx`, `src/components/cuf/CUFDriverAnalysis.tsx` | Valuable transparency content, but exposed as research terminology instead of decision support. |
| `/explorer` | Project catalog | `src/pages/Explorer.tsx`, `src/components/explorer/ProjectExplorer.tsx` | Has search, risk filtering, sorting, and table/card modes; ministry, status, cost, and delay filters are incomplete. |
| `*` | Not found | `src/pages/NotFound.tsx` | Minimal recovery path; should retain the dashboard CTA and add route context. |

### Shared shell and global interactions

- `src/App.tsx` owns initial project and alert loading, the page outlet, the copilot, the project detail modal, sector filtering, and the footer. This makes the shell a high-blast-radius component.
- `src/components/common/Header.tsx` combines branding, live clock, portfolio counters, navigation, alerts, user controls, and copilot launch. It is visually dense and exposes seven primary destinations with mixed levels of importance.
- `src/components/explorer/ProjectDetailModal.tsx` is the current project dossier boundary. It should become a real project details route so a project can be bookmarked, refreshed, shared, and revisited.
- `src/components/assistant/ProjectIntelligenceCopilot.tsx` is a useful secondary assistant, but its fallback copy is long and uses technical language. It should remain available globally without competing with primary CTAs.
- `src/components/common/Modal.tsx`, `StatCard.tsx`, and `RiskGauge.tsx` are the beginnings of a reusable system. They currently use inline styling and do not provide a shared loading, empty, error, or accessible dialog pattern.

### Data and service layer

- `src/types/index.ts` contains the core contracts: `Project`, `EarlyWarningAlert`, benchmark records, model comparison metrics, SHAP attribution, and what-if simulation input/output.
- `src/services/projectService.ts` is API-ready and falls back to `MOCK_PROJECTS`, `MOCK_ALERTS`, and mock analytics when routes are unavailable. This behavior must remain intact.
- `src/data/mockProjects.ts`, `mockAlerts.ts`, and `mockAnalytics.ts` contain the presentation-ready baseline. They provide rich project-level milestones and bottlenecks, but they do not contain every visualization requested in the brief, such as historical expenditure series, actual-vs-predicted points, residuals, or a state-by-sector heatmap.
- `src/services/api.ts` owns the Axios base URL and session bearer token. It must not be bypassed by the redesigned screens.

## 2. What the Current UI Communicates

### Dashboard

It communicates portfolio scale, revised cost, cumulative expenditure, alerts, average delay, an S-curve, a risk gauge, sector benchmarking, and four flagship projects. The intended message is "PRAGYA sees the whole portfolio and can predict trouble early."

The problem is that the top-level questions are not answered in a compact sequence. "Portfolio Outlay," "Cumulative Expenditure," "Early Warning Flags," and "Average Schedule Delay" compete with each other, while the requested total predicted cost overrun and delayed-project count are not the obvious hero metrics. The first actionable list is below a table and chart rather than immediately visible.

### Project Explorer

It communicates that the repository is searchable and sortable. The current search covers name, agency, state, and PAIMANA ID, but not ministry or sector through the text field. Only sector and risk filters are available; status, cost range, and delay range are missing. The table and cards use different amounts of detail, which makes switching modes feel like changing products.

### Project detail modal

The dossier communicates rich project telemetry, but a modal is the wrong information architecture for a complete project story. It limits deep linking, URL history, responsive vertical space, and the ability to compare project details with the project list. The content is also spread across model-specific pages, so users see the same project selector and project metadata repeatedly.

### Predictions

The cost screen communicates a what-if simulator, an AI-versus-statistical comparison, and a portfolio escalation table. The schedule screen communicates milestone slippage and bottlenecks. Together they contain useful decisions, but the page starts with model names and technical descriptions rather than a plain-language answer such as "This project is expected to finish 8 months late and cost 12% more."

### Risk

The risk screen communicates a PCRI composite score, four weighted dimensions, and a cost-versus-delay quadrant. It is useful for analysts, but "PCRI," "composite score," and numerical dimensions are not explained at the point of use. It duplicates project selection, risk badges, and dossier actions from the prediction screens.

### Alerts

The alerts screen communicates priority, affected project, lead time, predicted cost impact, predicted schedule impact, and recommendations. This is closest to an operational workflow. It still uses acronyms and implementation-heavy prose, and the visible action buttons need a stronger state model, confirmation feedback, and an empty state after filtering.

### Benchmarking

The benchmarking screen communicates ministry and agency performance through tables. It does not yet answer which peer is improving, which sector is an outlier, or why a ranking matters. Sector benchmarks are separately used on the dashboard, creating two places for comparative analysis.

### CUF and SHAP

The CUF screen communicates model feature attribution and a proposal for CUF 2.0. It is valuable model transparency content, but "SHAP," "CUF Field," and "External Non-CUF" are not translated into plain-language reasons a project is at risk. This content should move into Model Intelligence and Project Details, not remain a primary navigation destination.

## 3. Main UX Findings

### Information architecture problems

1. The current navigation has seven destinations, but users need five mental models: portfolio, projects, a project, analytics, and model transparency.
2. Risk, predictions, alerts, and CUF overlap around the same project health story.
3. A project is selected inside multiple pages and opened in a modal instead of having a canonical detail route.
4. Benchmarking is disconnected from the dashboard and does not include all requested portfolio analytics.
5. The copilot is global, but its placement and long welcome message make it feel like another primary destination.

### Terminology problems

| Current term | User-facing replacement |
| --- | --- |
| PCRI | Project health score |
| PCRI priority | Risk level |
| EWAS | Early warnings |
| CUF | Monthly project update data |
| SHAP feature importance | Main reasons behind the forecast |
| schedule variance | Months behind schedule |
| predicted final cost | Expected final cost |
| AI predicted outturn | Expected completion |
| regulatory friction | Clearances and approvals |
| contractor capability | Delivery capacity |
| statistical baseline | Previous forecasting method |
| telemetry | Latest project update |
| outlay | Approved portfolio cost |
| agency scorecard | Delivery performance |

Technical terms can remain in secondary explanations or tooltips, but not in primary headings or calls to action.

### Duplication

- Project name, sector, risk badge, agency, project selector, delay, and dossier CTA repeat in `CostOverrunModel`, `TimeOverrunModel`, and `RiskScoringFramework`.
- Portfolio cost, delay, and risk numbers repeat across dashboard cards, explorer summary cards, benchmark summary cards, and model tables.
- Sector comparison appears in dashboard `SectorBreakdown` and is implied again in benchmarking.
- Risk interpretation is repeated in `RiskGauge`, risk badges, PCRI labels, and model result badges without a single canonical explanation.
- Inline visual styling is duplicated throughout nearly every feature component.

### Missing or weak states

- App-level data loading has one generic message and no skeleton structure.
- `Promise.all` in `App.tsx` does not expose a recoverable error state.
- Project and alert lists have no explicit empty state when filters return zero results.
- Benchmarking and CUF screens have no loading or failure presentation because they read static imports directly.
- The simulator has an implicit loading state but no visible result skeleton or retry state.
- Modal focus management and focus return are incomplete; only Escape and body scroll locking are implemented.
- Several clickable rows and project headings are `div` or `h3` elements rather than keyboard-accessible buttons or links.

### Visual hierarchy and interaction issues

- The current UI is polished but dense: all sections look like equally important glass panels.
- Tables carry too many columns for an executive first pass.
- The dashboard uses a sector table where a compact health snapshot and attention queue would be more useful.
- CTAs are inconsistent: "Explore Predictive Models," "View Dossier," and "View All" do not share a clear action hierarchy.
- CSS animations exist, but Framer Motion is not installed and animation behavior is scattered between inline styles and global CSS.
- There is no route-level code splitting, and the entire application is loaded through the root entry.
- Existing UI primitives under `src/components/ui` are only lightly used; feature screens mostly bypass them with inline styles.

## 4. Recommended Changes: Remove, Merge, Rename, Reorganize

### Remove from primary navigation

- Remove `Risk Scoring (PCRI)` as a standalone destination. Its portfolio quadrant moves to Analytics; its selected-project explanation moves to Project Details.
- Remove `CUF Drivers & SHAP` as a standalone destination. Its global explanation moves to Model Intelligence; project-specific drivers move to Project Details.
- Remove `Predictive Models` as a technical destination. The useful what-if simulator becomes a Project Details tool, while model comparison and validation move to Model Intelligence.
- Remove `Benchmarking` as a standalone name. Rename and expand it into Analytics.
- Remove `Early Warning (EWAS)` as a top-level duplicate only if its triage feed is represented as the dashboard attention queue. Keep a dedicated filtered view inside Projects or Analytics if operational users need the full feed.

### Merge into the five requested experiences

1. Dashboard: `ExecutiveDashboard`, `PortfolioHealth`, the useful parts of `SectorBreakdown`, and the top alert/project cards.
2. Projects: `ProjectExplorer`, alert-to-project navigation, filters, sorting, and list/grid modes.
3. Project Details: `ProjectDetailModal`, `TimeOverrunModel`, selected-project risk breakdown, bottlenecks, cost simulator, and recommendations.
4. Analytics: `BenchmarkAnalytics`, sector comparison, portfolio trend, risk quadrant, heatmap, delay distribution, and ministry performance.
5. Model Intelligence: `CostOverrunModel` benchmark tab, `CUFDriverAnalysis`, global feature importance, validation metrics, certification, and model routing explanation.

### Preserve

- Existing API calls and response shapes.
- Mock fallback behavior in `projectService.ts`.
- Authentication and protected route behavior.
- Existing project and alert actions, including alert status updates and project selection.
- The copilot as an optional global assistant.

## 5. New Sitemap

```text
/login
/
  /dashboard                       Executive Dashboard
  /projects                       Projects
  /projects/:projectId            Project Details
  /analytics                      Analytics
  /model-intelligence             Model Intelligence
```

Suggested compatibility redirects during migration:

```text
/explorer       -> /projects
/risk           -> /analytics#risk
/alerts         -> /projects?view=alerts
/benchmarking   -> /analytics
/cuf            -> /model-intelligence#drivers
/predictions    -> /model-intelligence
```

The redirects preserve bookmarks and reduce disruption while the five-experience navigation is introduced.

## 6. New Page Hierarchy and Wireframes

### Executive Dashboard

1. Page header: "Portfolio health" with reporting period, last updated time, and one primary CTA: "Review projects needing attention."
2. Hero KPI row: Total projects, high-risk projects, delayed projects, expected cost overrun. Each includes icon, trend, percentage change, and compact sparkline.
3. Portfolio health band: a single risk gauge with Low, Medium, and High zones plus a one-sentence interpretation.
4. Attention queue: the top five projects sorted by urgency. Each row shows project, sector, risk, expected delay, expected cost increase, reason, and "View details."
5. Sector snapshot: seven compact sector cards with health score, risk count, delay, and a link into Projects with the sector filter applied.
6. Optional secondary analytics: portfolio trend and expenditure S-curve below the decision queue, collapsed or lower contrast.

### Projects

1. Header: "Projects" with count, last update, and optional export/refresh action.
2. Search field with explicit scope: name, ministry, sector, state, or project ID.
3. Filter rail or responsive filter drawer: risk, ministry, sector, status, cost range, delay range.
4. Result summary: visible count, high-risk count, average delay, expected cost increase.
5. Sortable table on desktop, cards on mobile. Columns: name, ministry, sector, state, progress, risk, delay, cost increase, health, updated.
6. Empty state: explain which filters removed results and offer "Clear filters."

### Project Details

1. Hero: project name, ministry, sector, state, health score, risk level, confidence, status, and timeline status.
2. Decision summary: "What needs attention" with plain-language forecast and the primary risk reason.
3. Timeline: interactive milestone line with completed, current, at-risk, delayed, and pending states.
4. Cost: approved, current, expected final cost, and increase; show a simple expenditure trend.
5. Schedule: planned, revised, and expected completion on a Gantt-style comparison.
6. Forecast explanation: expected risk, delay, cost increase, confidence, and main reasons.
7. Bottlenecks: feature-importance cards translated to human language.
8. Recommendations: prioritized actions with owner/action/status language.
9. What-if simulator: a secondary tab or expandable tool, never the first screen.

### Analytics

1. Header and period controls.
2. Risk heatmap by state and sector.
3. Sector comparison with health, delay, cost increase, and high-risk count.
4. Cost-overrun trend line and delay distribution.
5. Ministry performance ranking with a clear "best/worst movement" interpretation.
6. Portfolio trend over time.
7. Risk quadrant as an optional analytical view, with accessible table fallback.

### Model Intelligence

1. Plain-language model overview: version, last trained, dataset size, coverage.
2. Validation metric cards: R-squared, mean absolute error, root mean squared error, cross-validation score, each with a short interpretation.
3. Train versus test comparison and overfitting indicator.
4. Actual-versus-expected scatter and residual distribution, with table alternatives.
5. Sector performance table.
6. Global model versus sector model routing explanation, including global fallback.
7. Main drivers behind forecasts: horizontal bars and plain-language descriptions.
8. Certification card: cross-validation passed, leakage checked, generalization passed, model certified.

## 7. Design System

### Visual direction

- Light executive workspace with blue as the trust color, restrained purple for intelligence/model surfaces, and green/amber/red reserved for health states.
- Frosted surfaces only where they support grouping; use solid readable backgrounds for dense tables and charts.
- One page background, one primary surface, one elevated surface, and one alert surface. Avoid stacking cards inside cards without clear hierarchy.
- Use a modern display face for page headings and a highly legible sans-serif for body copy. Keep numerical values tabular and easy to scan.

### Tokens

- Spacing scale: 4, 8, 12, 16, 24, 32, 48.
- Radii: 8px for controls, 12px for cards, 16px only for hero surfaces and dialogs.
- Semantic colors: `health-good`, `health-watch`, `health-high`, `health-critical`, `accent-primary`, `accent-intelligence`, `text-primary`, `text-secondary`, `border-subtle`.
- Focus ring: visible on every keyboard-interactive element with a minimum 3:1 contrast against the adjacent surface.
- Data visualization palette: use color plus labels/patterns, never color alone.

### Language rules

- Lead with the decision, then show the evidence.
- Prefer "8 months behind schedule" to `schedule_variance`.
- Prefer "Expected final cost: Rs X Cr" to "AI predicted outturn."
- Explain abbreviations once in secondary text.
- Every chart title states the insight or comparison, not just the chart type.

## 8. Component Breakdown

### Foundations

- `AppShell`, `PageHeader`, `PrimaryNav`, `MobileNav`, `Breadcrumbs`.
- `GlassCard`, `Section`, `Stack`, `Grid`, `Divider`.
- `Button`, `IconButton`, `SegmentedControl`, `Select`, `SearchField`, `FilterDrawer`.

### Decision components

- `KpiCard` with trend, sparkline, tooltip, and accessible label.
- `HealthBadge`, `RiskBadge`, `ConfidenceBadge`, `StatusBadge`.
- `ProgressRing`, `RiskGauge`, `MiniSparkline`.
- `AttentionProjectRow`, `RecommendationCard`, `AlertTriageCard`.
- `ProjectTable`, `ProjectCard`, `ProjectSummary`, `ProjectHero`.

### Detail and analytics components

- `MilestoneTimeline`, `ScheduleBar`, `CostSummary`, `CostTrendChart`, `RiskReasonCard`.
- `RiskHeatmap`, `SectorComparison`, `DelayDistribution`, `MinistryRanking`, `PortfolioTrend`.
- `ModelMetricCard`, `ValidationComparison`, `OverfitIndicator`, `ScatterPlot`, `ResidualHistogram`, `FeatureImportanceList`, `CertificationCard`.

### State components

- `PageSkeleton`, `KpiSkeleton`, `TableSkeleton`, `ChartSkeleton`.
- `EmptyState`, `FilteredEmptyState`, `ErrorState`, `RetryButton`, `Toast`, `Dialog` with focus management.

## 9. Animation Plan

- Route transition: short opacity and vertical translate, reduced-motion aware.
- Dashboard entry: stagger KPI cards and attention rows once, not on every state update.
- KPI values: count-up only when data first arrives or changes materially.
- Progress rings and bars: animate from zero with a 500-700ms ease-out.
- Charts: reveal series progressively, with hover/focus annotations.
- Project cards: small elevation and border emphasis on hover; no layout shift.
- Dialog and copilot: scale/opacity entrance with focus transfer and Escape support.
- Loading: skeleton shimmer for data regions; avoid implying live telemetry when the source is mock data.
- Respect `prefers-reduced-motion` by disabling transforms, stagger, and chart animation.

## 10. Accessibility and Responsiveness

- Use semantic landmarks and a single page heading per route.
- Use real links for navigation and real buttons for actions. Do not make headings or generic divs clickable.
- Add accessible names and descriptions to gauges, charts, filters, and icon-only controls.
- Provide a visible table alternative for every chart or heatmap.
- Make the project table horizontally scrollable on tablet and transform to cards on mobile.
- Collapse the desktop navigation into a drawer on narrow screens.
- Keep action targets at least 40px high and maintain focus visibility.
- Announce alert status changes through an `aria-live` region.

## 11. Performance Plan

1. Route-load the five main experiences with `React.lazy` and `Suspense`.
2. Keep mock fallback and API service calls in the service layer; do not fetch separately from every visual component.
3. Derive filtered/sorted project lists once per page state and avoid repeated recalculation in child components.
4. Render only the visible project rows when the real portfolio grows beyond the mock sample.
5. Use one charting abstraction with accessible fallbacks rather than several ad hoc SVG implementations.
6. Keep the global copilot and project detail route mounted only when needed.
7. Centralize formatting for dates, rupee values, percentages, months, and human-readable risk labels.

## 12. Step-by-Step Implementation Plan

### Phase 0: Contract safety

- Freeze current TypeScript domain types and `projectService` method signatures.
- Add route compatibility redirects before moving screens.
- Create formatting and semantic-label helpers without changing API payloads.

### Phase 1: Foundations

- Introduce shared layout, navigation, card, badge, state, and chart containers.
- Move repeated inline styles into design tokens and scoped classes.
- Add reduced-motion and focus styles.

### Phase 2: Executive Dashboard

- Recompose existing mock statistics into the four required KPIs.
- Add attention queue and sector snapshot using existing project and benchmark data.
- Keep the S-curve and health gauge as secondary evidence.

### Phase 3: Projects and Project Details

- Rename Explorer to Projects and add the requested filters.
- Replace the modal-first dossier with `/projects/:projectId`, retaining a dialog fallback only where appropriate.
- Merge timeline, cost, schedule, risk reasons, bottlenecks, recommendations, and what-if simulation.

### Phase 4: Analytics

- Move ministry, agency, sector, and risk comparison into one route.
- Add only visualizations supported by existing data first.
- Add explicit unavailable-data states for heatmaps and historical charts until compatible data arrives; do not invent backend responses.

### Phase 5: Model Intelligence

- Move CUF/SHAP and model comparison into the transparency route.
- Translate model outputs into plain language while preserving technical detail in expandable explanations.
- Add validation and certification sections from available metadata; mark unavailable metrics as unavailable rather than fabricating them.

### Phase 6: Quality and performance

- Add lazy routes, accessible chart alternatives, loading/error/empty states, and responsive testing.
- Validate mock mode with the backend stopped and API mode with available routes.
- Run build, lint, keyboard navigation checks, and desktop/tablet/mobile visual review.

## 13. Acceptance Criteria

- A first-time user can identify portfolio size, high-risk count, delayed count, and expected cost increase within ten seconds.
- A user can reach a canonical project URL from the dashboard, project list, alert, or copilot.
- A project detail view explains status, timeline, cost, forecast, reasons, and recommendations without requiring knowledge of PCRI or SHAP.
- The primary navigation contains exactly the five requested experiences plus authentication.
- Existing mock fallback and API calls continue to work without backend or ML changes.
- Every filter, table, chart, dialog, and navigation action works with keyboard input and has a meaningful empty/error/loading state.
- Desktop, tablet, and mobile layouts remain readable without overlapping text or controls.
