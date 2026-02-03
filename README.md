# Fintech Automation Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Visual Flow Builder for the Sapliy Fintech Ecosystem**

Build event-driven automations for payments, notifications, and financial events — no code required.

## Core Concept

Automation Studio implements the **Zone → Event → Flow** model:

```
┌─────────────────────────────────────────────────────┐
│  Zone (isolated automation space)                   │
│  ┌───────────┐    ┌───────────┐    ┌────────────┐  │
│  │  Events   │ → │   Flows   │ → │  Actions    │  │
│  │ from SDK  │    │ (logic)   │    │ (webhooks) │  │
│  └───────────┘    └───────────┘    └────────────┘  │
└─────────────────────────────────────────────────────┘
```

Each zone has:
- **Test mode** — Safe experimentation with `pk_test_*` keys
- **Live mode** — Production events with `pk_live_*` keys
- Separate logs, flows, and events per mode

## Features

### 🎯 Event Triggers
| Source | Events |
|--------|--------|
| **Payments** | `payment.succeeded`, `payment.failed`, `refund.created` |
| **Wallets** | `balance.changed`, `low_balance` |
| **Ledger** | `transaction.created`, `entry.posted` |
| **Schedule** | Cron-based triggers |
| **Manual** | Trigger from UI or CLI |

### 🧠 Logic Nodes
- **Condition** — If/else branching
- **Filter** — Event filtering
- **Rate Limit** — Prevent flooding
- **Approval** — Human-in-the-loop
- **Timeout** — Delay and timeout

### 📤 Action Nodes
- **Webhooks** — HTTP to external services
- **Notifications** — WhatsApp, Email, Slack, Discord
- **Audit Log** — Create audit entries
- **Debugger** — Log and inspect

## Architecture

```
┌─────────────────────────────────────┐
│  Fintech Automation Studio         │
│  (This repo - UI only)             │
└──────────────┬──────────────────────┘
               │ REST / WebSocket
               ▼
┌─────────────────────────────────────┐
│  fintech-ecosystem                  │
│  (Events, Flows, Execution)         │
└─────────────────────────────────────┘
```

> **Important**: This UI does NOT execute flows. All logic runs in `fintech-ecosystem`.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` to access the Flow Builder.

## Environment Variables

```env
# API endpoint (required)
NEXT_PUBLIC_API_URL=http://localhost:8080

# WebSocket for real-time events
NEXT_PUBLIC_WS_URL=ws://localhost:8080/events
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # UI components
│   ├── flow/         # Flow builder components
│   ├── nodes/        # Node type components
│   └── ui/           # Shared UI components
├── hooks/            # React hooks
├── services/         # API client
├── store/            # Zustand state
└── types/            # TypeScript definitions
```

## User Roles

| Role | Capabilities |
|------|--------------|
| **Admin** | Full access, manage org settings |
| **Finance** | View transactions, approve flows |
| **Developer** | Create and edit automations |
| **Viewer** | Read-only access |

## Roadmap

- **Phase 1** ✅ — Core flow builder, events, automations
- **Phase 2** — Approvals, manual actions
- **Phase 3** — Marketplace, templates, paid plans

## Part of Sapliy Fintech Ecosystem

| Repo | Purpose |
|------|---------|
| [fintech-ecosystem](https://github.com/Sapliy/fintech-ecosystem) | Core backend (events, flows, execution) |
| [fintech-sdk-node](https://github.com/Sapliy/fintech-sdk-node) | Node.js SDK |
| [fintech-sdk-python](https://github.com/Sapliy/fintech-sdk-python) | Python SDK |
| [fintech-sdk-go](https://github.com/Sapliy/fintech-sdk-go) | Go SDK |
| [fintech-ui](https://github.com/Sapliy/fintech-ui) | React components |
| [sapliy-cli](https://github.com/Sapliy/sapliy-cli) | Developer CLI |

## License

MIT © [Sapliy](https://github.com/sapliy)
