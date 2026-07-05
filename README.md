# Retail Analytics Platform

A production-ready full-stack Retail Analytics Platform built with **React 19**, **Vite**, **Tailwind CSS v4**, **React Router v6**, and **Recharts**.

The design aesthetics of this dashboard are inspired by enterprise data tools: **Microsoft Fabric**, **Databricks Workspaces**, and **Power BI**. It features clean glassmorphic panels, animated counters, smooth page transitions, and a dark/light mode toggle.

---

## ⚡ Tech Stack & Libraries
- **Frontend Core**: React 19, Javascript (ES modules)
- **Tooling/Compiler**: Vite 6 (Optimized configuration)
- **Styling**: Tailwind CSS v4 (Using the new CSS-based `@theme` variables)
- **Routing**: React Router (Protected layout guards & dynamic navigation redirects)
- **Data Visualizations**: Recharts (Custom Tooltips, responsive grids, dark/light dynamic rendering)
- **Iconography**: Lucide React (Fluent design system)
- **Services Layer**: Axios (Pre-configured for future FastAPI connection states)

---

## 📁 Project Structure
The project is laid out cleanly based on modern frontend architecture practices:

```
retail-analytics-platform/
├── dist/                   # Production build distribution bundle
├── public/                 # Static asset hosting (logos, icons)
├── src/
│   ├── main.jsx            # Application react mounting entry point
│   ├── App.jsx             # Route mapping, protected layout wrapper, theme integration
│   ├── App.css             # Main styling clears
│   ├── index.css           # Google Fonts, Tailwind v4 variables, global custom overrides
│   ├── assets/             # Brand logos & background images
│   ├── hooks/
│   │   └── useTheme.js     # Custom light/dark mode state sync hook
│   ├── utils/
│   │   └── helpers.js      # Currencies, large numbers, and percentage formatted values
│   ├── services/
│   │   └── api.js          # In-memory Superstore mock database & delayed API simulation
│   ├── components/
│   │   ├── Navbar.jsx      # Top panel: search, notifications dashboard, profile configurations
│   │   ├── Sidebar.jsx     # Navigation Panel: drawer links, active highlights, logout methods
│   │   ├── KPICard.jsx     # Metrics dashboard block with cubic ease-out AnimatedCounter
│   │   ├── Charts.jsx      # Visual Recharts wrappers (Bar, Pie, Horizontal Bar, Line charts)
│   │   ├── Tables.jsx      # Reusable DataTable: pagination, column sort, query search, CSV exporter
│   │   ├── Loader.jsx      # Spinner glass loaders & Skeleton UI card overlays
│   │   └── Toast.jsx       # Alert blocks for system warnings/notifications
│   └── pages/
│       ├── Login.jsx       # Gatekeeper: auth inputs, "remember me" caching, simulated reset modals
│       ├── Dashboard.jsx   # Aggregated analytics hub: KPIs, main graphs, top states preview
│       ├── Analytics.jsx   # Interactive explorer: Region/Category selectors, transaction grids
│       ├── Upload.jsx      # Ingestion portal: drag-and-drop CSV validator, pipeline triggering
│       ├── PipelineStatus.jsx # PySpark notebook track hub: stage visualizer, live console logs
│       ├── SQLReports.jsx  # SQL playground: predefined warehouse reports, pySpark syntax displays
│       └── Settings.jsx    # Application control panel: user metadata, theme tile select
```

---

## 🔌 API Catalog & Future Databricks/FastAPI Integration
All data requests inside `src/services/api.js` have been mapped to mimic a FastAPI endpoint architecture fetching data from a **Databricks Gold Layer SQL Warehouse**. 

### Endpoint Signatures
- **Auth Endpoint**: `login(email, password)`
  - future endpoint: `POST /api/auth/login`
- **KPI Indicators & Trends**: `getDashboard()`
  - future endpoint: `GET /api/dashboard`
- **Sales by Region Bar**: `getRegionSales()`
  - future endpoint: `GET /api/region-sales`
- **Sales by Category Pie**: `getCategorySales()`
  - future endpoint: `GET /api/category-sales`
- **Top 10 Revenue States**: `getTopStates()`
  - future endpoint: `GET /api/top-states`
- **Discounts Line Correlation**: `getDiscountAnalysis()`
  - future endpoint: `GET /api/discount-analysis`
- **CSV Drag-Upload**: `uploadCSV(file, onProgress)`
  - future endpoint: `POST /api/upload`
- **Lakehouse Pipeline Trigger**: `triggerPipeline(onStageUpdate)`
  - future endpoint: `POST /api/trigger-pipeline`

---

## 🚀 Installation & Running Locally

### Prerequisites
- Node.js (v20.17.0+ recommended)
- npm (v10+)

### Setup Commands
1. Navigate into the application root:
   ```bash
   cd retail-analytics-platform
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
4. Build the optimized production bundle:
   ```bash
   npm run build
   ```
5. Preview the built production assets locally:
   ```bash
   npm run preview
   ```
