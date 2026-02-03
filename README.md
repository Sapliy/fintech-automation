# Fintech Automation Studio

**Event & Automation Studio for FinTech + Operations**

Build powerful automation flows for payments, notifications, and financial events. Part of the [Sapliy Fintech Ecosystem](https://github.com/Sapliy/fintech-ecosystem).

---

## Overview

Fintech Automation Studio is a visual flow builder that lets you create event-driven automations for:
- **Payment Events** — React to Stripe events, payment failures, refunds
- **Wallet Events** — Balance changes, low balance alerts
- **Transaction Events** — Ledger entries, audit triggers
- **System Events** — Scheduled tasks, manual triggers

## Features

### 🎯 Event Triggers
- Stripe events (payment.succeeded, payment.failed, refund.created)
- Wallet events (balance.changed, low_balance)
- Ledger events (transaction.created, entry.posted)
- Schedule triggers (cron-based)
- Manual triggers

### 🧠 Logic Nodes
- **Condition** — If/else branching based on event data
- **Filter** — Filter events by criteria
- **Rate Limit** — Prevent action flooding
- **Approval** — Human approval workflows
- **Timeout** — Delay and timeout logic

### 📤 Action Nodes
- **Notifications** — WhatsApp, Email, Slack, Discord
- **Webhooks** — HTTP requests to external services
- **Audit Log** — Create audit trail entries
- **Debugger** — Log and inspect flow data

### 🔧 Utilities
- **AI Analysis** — AI-powered event analysis
- **Debugger** — Flow debugging and logging

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` to access the Flow Builder.

---

## Architecture

```
┌─────────────────────────────────┐
│ Fintech Automation Studio       │
│ (Flow Builder UI)               │
└─────────────┬───────────────────┘
              │ REST / WebSocket
┌─────────────▼───────────────────┐
│ Fintech Ecosystem Core          │
│ (Events, Ledger, Wallets)       │
└─────────────────────────────────┘
              │
     External Systems (Stripe, Notifications)
```

---

## Environment Variables

```env
# Fintech Ecosystem API
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/events

# Authentication
VITE_AUTH_URL=http://localhost:8080/auth
```

---

## Project Structure

```
src/
├── components/       # UI components
├── hooks/            # React hooks (useEventStream, useAuth)
├── nodes/            # Flow node components
│   ├── triggers/     # Event trigger nodes
│   ├── logic/        # Condition, filter, approval nodes
│   └── actions/      # Notification, webhook, audit nodes
├── pages/            # App pages (EventTimeline, Transactions)
├── services/         # Business logic services
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

---

## Core Users

| Role | Capabilities |
|------|--------------|
| **Admin** | Full access, manage org settings |
| **Finance** | View transactions, approve flows |
| **Developer** | Create and edit automations |
| **Viewer** | Read-only access |

---

## Roadmap

- **Phase 1** (Current) — Read-only finance, events, automations, notifications
- **Phase 2** — Approvals, manual actions, IoT plugin
- **Phase 3** — Paid plans, compliance, marketplace

---

## Part of Sapliy Fintech Ecosystem

- [fintech-ecosystem](https://github.com/Sapliy/fintech-ecosystem) — Core backend services
- [fintech-sdk-node](https://github.com/Sapliy/fintech-sdk-node) — Node.js SDK
- [fintech-sdk-python](https://github.com/Sapliy/fintech-sdk-python) — Python SDK
- [fintech-sdk-go](https://github.com/Sapliy/fintech-sdk-go) — Go SDK

---

## License

MIT

