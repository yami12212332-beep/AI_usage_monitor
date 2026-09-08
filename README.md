# AI Usage & Cost Dashboard

An enterprise-grade analytics dashboard for monitoring, analyzing, and optimizing AI tool usage and costs across **Anthropic Claude** and **GitHub Copilot**. The application enables engineering leaders, finance teams, and department heads to track expenditures, analyze token volumes, spot usage anomalies, and manage organizational datasets.

---

## 🚀 Quick Start: How to Run the App

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`

### Installation & Execution Steps

1. **Clone or download the repository**:
   ```bash
   git clone <repository-url>
   cd ai-usage-cost-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *(Or `bun install` / `pnpm install` / `yarn install`)*

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
   *(The dev server is configured to bind to host `0.0.0.0` on port `3000`)*

### Additional Scripts

- **Type Check & Lint**:
  ```bash
  npm run lint
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
- **Preview Production Build**:
  ```bash
  npm run preview
  ```

---

## 📁 Code Structure

```
├── .env.example               # Environment variables template
├── index.html                 # Main HTML entry point
├── metadata.json              # Platform metadata and app settings
├── package.json               # NPM packages, scripts, and dependencies
├── tsconfig.json              # TypeScript compiler configuration
├── vite.config.ts             # Vite build & Tailwind CSS plugin setup
├── public/                    # Static assets & icons
└── src/                       # Application source code
    ├── main.tsx               # React DOM entry point
    ├── App.tsx                # Main dashboard component, state, and filters
    ├── index.css              # Global styles & Tailwind CSS v4 imports
    ├── types.ts               # Core TypeScript types and data models
    ├── data/
    │   └── sampleData.ts      # 60-day enterprise sample dataset with realistic records
    ├── utils/
    │   └── analytics.ts       # Aggregation engine, token calculations, and outlier detection
    └── components/
        ├── TopBar.tsx              # Header with granularity and period selectors, modal toggle
        ├── FilterBar.tsx           # Department and AI provider filter controls
        ├── SummaryCards.tsx        # High-level KPI metric cards (Spend, Tokens, Provider Share)
        ├── TrendChart.tsx          # Time-series multi-line consumption & spend charts
        ├── DepartmentChart.tsx     # Department stacked bar charts and breakdown tables
        ├── TopUsersGrid.tsx        # User leaderboards, >2x median outlier detection, and directory
        └── DataManagementModal.tsx # Dataset upload (CSV/TSV/JSON), Excel paste, and data manager
```

---

## 🎯 Key Features

### 1. Granularity & Time Period Filtering
- Switch between **Daily**, **Weekly**, and **Monthly** time aggregations.
- Interactive period selector allowing deep-dives into specific days, weeks, months, or the complete all-time view.
- Period filters automatically synchronize across KPI cards, trend charts, department allocations, and user tables.

### 2. Department-Level Analytics
- Stacked distribution chart comparing Claude and Copilot adoption by department.
- Detailed department table tracking total spend, token count, provider breakdown, and active headcount.
- Search and sorting capabilities by cost, tokens, and active team size.

### 3. User Directory & Outlier Detection
- Leaderboard cards for top Claude and Copilot power users.
- Automated anomaly detection flagging users consuming **>2x the organizational median**.
- Searchable, filterable enterprise user table with CSV export.

### 4. Dataset & Excel Interchange
- **Dedicated Claude & Copilot Import Sections**:
  - Drag-and-drop file upload (`.csv`, `.tsv`, `.txt`, `.json`).
  - Direct paste box compatible with Microsoft Excel and Google Sheets.
  - 1-click sample dataset generators for instant testing.
- **Automated Token & Billing Calculations**:
  - Preserves imported billing data or calculates costs using standard platform token rates when pricing is omitted.
- **Dataset Manipulation**:
  - **Replace Dataset**: Overwrite all records or replace only a specific provider's data.
  - **Concatenate (Append)**: Merge new rows into the existing active dataset without losing previous entries.
  - **Export Dataset**: Download active data as clean CSV.

---

## 📊 Expected Data Schema

When uploading or pasting custom data, the parser supports flexible column headers (case-insensitive):

| Column Name | Accepted Aliases | Description |
|---|---|---|
| `date` | `timestamp`, `day` | Date in `YYYY-MM-DD` format |
| `user_name` | `user`, `employee`, `email` | User identifier or name |
| `department` | `dept`, `team`, `division` | Organizational department |
| `ai_provider` | `platform`, `tool`, `provider` | `Claude` or `Copilot` |
| `model` | `engine`, `model_name` | Model name (e.g., `claude-3-5-sonnet`) |
| `total_tokens` | `tokens`, `token_count` | Total tokens consumed |
| `cost_usd` | `cost`, `billing`, `spend`, `price` | Spend in USD (auto-computed if omitted) |

---

## 🛠️ Technology Stack

- **Framework**: React 19 with TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS v4
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React
- **Animations**: Motion
