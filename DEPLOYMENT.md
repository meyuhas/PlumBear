# 🚀 PlumBear MVP Deployment Guide

## Quick Start

### 1. Setup Supabase (Database)

1. Go to [supabase.com](https://supabase.com)
2. Create new project (free tier)
3. In SQL Editor, run `backend/src/db/schema.sql`
4. Get your API keys from Settings → API

```
SUPABASE_URL=https://[project].supabase.co
SUPABASE_KEY=[anon-key]
```

### 2. Setup Stripe (Payments)

1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Get test keys from Dashboard → Developers → API Keys

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. New Project → GitHub Repo → Select plumbear-mvp
3. Add environment variables:
   - SUPABASE_URL
   - SUPABASE_KEY
   - STRIPE_SECRET_KEY
   - PORT=3001
4. Deploy! Railway will auto-deploy on git push

Backend URL: `https://[railway-domain].railway.app`

### 4. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo → plumbear-mvp/customer-app
3. Add environment variables:
   - NEXT_PUBLIC_API_URL=`https://[railway-domain].railway.app`
   - NEXT_PUBLIC_STRIPE_KEY=pk_test_...
4. Deploy!

Frontend URL: `https://[vercel-domain].vercel.app`

### 5. Test the Flow

1. Open customer app: `https://[vercel-domain].vercel.app/book`
2. Fill form and submit
3. Check Supabase → jobs table for new record
4. Check backend logs for errors

## Database Setup

The schema includes:
- **customers** - Phone, name, address, location
- **plumbers** - Name, phone, license, rating, location
- **jobs** - Customer request + plumber assignment
- **reviews** - Customer ratings for plumbers
- **payments** - Payment records and splits

All tables created with proper indexes for fast queries.

## API Endpoints

```
POST   /api/jobs               - Create new job
GET    /api/jobs/:id           - Get job details
PATCH  /api/jobs/:id           - Update job status

POST   /api/plumbers           - Register plumber
GET    /api/plumbers           - List all plumbers
GET    /api/plumbers/:id/jobs  - Get plumber's jobs

POST   /api/payments/intent    - Create payment intent
POST   /api/payments/confirm   - Confirm & payout
```

## Next Steps

1. **Plumber App** - React Native for job notifications
2. **Real SMS Notifications** - Setup Twilio
3. **Plumber Registration** - Admin panel to add plumbers
4. **Live Tracking** - WebSocket for real-time GPS
5. **Admin Dashboard** - Monitor all jobs & payments

## Troubleshooting

**Frontend can't connect to backend:**
- Check NEXT_PUBLIC_API_URL environment variable
- Verify backend is running on Railway
- Check CORS is enabled in Express

**Database errors:**
- Verify Supabase project is running
- Check API keys are correct
- Run schema.sql again if tables missing

**Payment issues:**
- Verify Stripe keys are correct
- Check Stripe test mode is enabled
- Test with Stripe test card: 4242 4242 4242 4242

## Cost Estimate

- Supabase: FREE (generous free tier)
- Railway: ~$5-10/month for small backend
- Vercel: FREE (generous free tier)
- Stripe: 2.9% + $0.30 per transaction
- Twilio: $0.0075 per SMS

**Total for MVP: ~$10-15/month**

---

## Once Live

When database is populated with real plumbers, system will:
1. Customers book via form
2. Backend auto-matches to nearby plumber
3. Plumber gets SMS notification
4. System tracks real-time progress
5. Payment processed on completion
6. Review collected from customer
