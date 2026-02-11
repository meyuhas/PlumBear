# 🐻 PlumBear MVP

Autonomous AI-powered plumbing marketplace. Real-time job matching between customers and plumbers.

## Architecture

```
plumbear-mvp/
├── customer-app/        # React frontend (customer booking)
├── plumber-app/         # React Native (plumber jobs)
├── backend/             # Node.js/Express API
├── database/            # Supabase/PostgreSQL schemas
└── docs/               # Architecture & deployment
```

## Stack

- **Frontend**: Next.js + React
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe Connect
- **Hosting**: Vercel (frontend) + Railway (backend)
- **SMS**: Twilio
- **Maps**: Google Maps API

## MVP Features

### Customer App
- [x] Booking form (address, issue type, phone)
- [ ] Real-time plumber tracking
- [ ] Payment processing
- [ ] Review system

### Plumber App
- [ ] Job notifications
- [ ] Accept/decline workflow
- [ ] Live GPS tracking
- [ ] Earnings dashboard
- [ ] Weekly payment tracking

### Backend
- [ ] Job creation & matching
- [ ] Plumber availability management
- [ ] Payment processing (Stripe)
- [ ] Review storage
- [ ] Admin dashboard

## Getting Started

```bash
git clone <repo>
cd plumbear-mvp

# Install dependencies
npm install --workspaces

# Setup environment
cp .env.example .env.local

# Run development servers
npm run dev
```

## Deployment

- Frontend: `vercel deploy`
- Backend: Railway connected to GitHub

## Status

🟢 **LIVE EXECUTION STARTED** - February 11, 2026
