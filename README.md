# Rudu Farm Management System - Backend

Production-ready backend built with Next.js, Prisma, Supabase, and Zod.

## Technology Stack
- Framework: Next.js (App Router API routes)
- Language: TypeScript
- ORM: Prisma
- Database: Supabase PostgreSQL
- Authentication: Supabase Auth
- Validation: Zod

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   * Ensure `DATABASE_URL` uses the pooler (port 6543).
   * Ensure `DIRECT_URL` uses the direct connection (port 5432).

3. **Database Migration**
   Run the initial migration to create all tables in your Supabase instance:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed Database**
   Seed the database with sample roles, farmers, and rates:
   ```bash
   npm run prisma:seed
   ```
   *Note: Auth Users (UUIDs) are mocked in the seed. For a real environment, you must create these users in Supabase Auth first.*

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Core Features Implemented
- **Role-Based Access Control:** `verifyAuth()` middleware enforces ADMIN, OPERATOR, or FARMER roles.
- **Time-bound Operator Sessions:** Validates the operator's current time against their `OperatorSchedule` (Asia/Kolkata timezone). Automatically expires sessions if they exceed their scheduled/extended end time.
- **Emergency Session Extensions & Force Logout:** Admins can extend an active session or immediately force-logout operators.
- **Transaction-Safe Operations:** Financial updates (Ledger, Collections, Payments, Advances) execute inside `$transaction` blocks to prevent race conditions and ensure data consistency.
- **Server-Side Rate Calculation:** Rates are calculated strictly by the server using `RateRule` configurations, preventing client-side spoofing.
- **Audit Logging:** Comprehensive tracking of all sensitive actions (Payments, Extensions, Logging out).

## Next Steps for Deployment (Vercel)
1. Push this repository to GitHub.
2. Import the `backend` folder into Vercel.
3. Configure the Environment Variables in Vercel.
4. Set the Install Command to: `npm install && npx prisma generate`.
5. Deploy.
