# perfl.io 🚀

## Setup 🛠️

### Prerequisites
- Node.js 18+
- pnpm

### Environment Variables ⚙️
```env
# Database
DATABASE_URL="your-database-url" # Add your database URL (e.g., from Neon)

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_**********
CLERK_SECRET_KEY=sk_test_**********
CLERK_WEBHOOK_SECRET=whsec_**********
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Quick Start 🏃
```bash
# Install deps
pnpm install

# Setup database
pnpm db:push   # Push schema to database
pnpm db:studio # Open Drizzle Studio

# Development
pnpm dev       # Start dev server with turbo
pnpm check     # Run lint & type checks
```

Your app should now be running at `http://localhost:3000` 🎉

