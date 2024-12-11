# perfl.io 🚀

## Setup 🛠️

### Prerequisites

- Node.js 18+
- PostgreSQL
- pnpm

### Environment Variables ⚙️

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_**********
CLERK_SECRET_KEY=sk_test_**********
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

### Database URL Format 🔗

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

Example:

```
postgresql://myuser:mypassword@localhost:5432/perfl
```

Your app should now be running at `http://localhost:3000` 🎉

## License

MIT
