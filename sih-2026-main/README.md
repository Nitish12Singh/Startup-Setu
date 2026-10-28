# StartupSetu | SIH 2026

**Discover Innovation. Prove Impact. Scale What Works.**

StartupSetu is a React-based platform for connecting innovation challenges, startups, evaluators, validators, and government stakeholders. The application includes challenge discovery, proposal submission, evaluation workflows, pilot management, evidence tracking, dashboards, and procurement decision support.

## Key Features

- Challenge marketplace and AI-assisted challenge builder
- Startup profiles, matching, and proposal submission
- Evaluator, validator, government, and admin dashboards
- Pilot management, evidence passports, and audit trail
- KPI reporting, scale planning, and procurement decision packs
- Support chatbot and responsive web interface

## Tech Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS
- **Visualizations and icons:** Recharts, Lucide React
- **Backend dependencies:** Express, CORS
- **Deployment configuration:** Vercel

## Getting Started

**Prerequisites:** Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build:

```bash
npm run build
npm run preview
```

> Note: The `server` and `start` scripts in `package.json` reference `server/index.js`, which is not included in this archive. They may require additional backend files before they can be used.

## Project Structure

- `App.jsx`, `main.jsx` — React application entry points
- `*Dashboard.jsx` — Role-specific dashboards
- `ChallengeMarketplace.jsx`, `AIChallengeBuilder.jsx` — Challenge workflows
- `ProposalSubmission.jsx`, `PilotManagement.jsx` — Proposal and pilot workflows
- `EvidencePassport.jsx`, `AuditTrail.jsx` — Evidence and audit features
- `aiEngine.js`, `db.js`, `routes.js` — Supporting logic
- `store.json` — Bundled application data; review before publishing
- `StartupSetu_SIH2026_26136_.pdf` — Project presentation

## Security and Data

The archive includes `store.json`, which may contain user records and activity logs. **Review and sanitize this file before making the repository public.** Do not commit real user credentials, personal data, or secrets. Configure production storage and authentication separately.

## Maintainer

**Nitish Kumar Singh**  
Email: [nitishofficial9026@gmail.com](mailto:nitishofficial9026@gmail.com)  
GitHub: [@Nitish12Singh](https://github.com/Nitish12Singh)

## License

No license has been specified in the provided project. Add a license only after confirming ownership and permissions.
