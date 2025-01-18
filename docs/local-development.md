# Local Development Guide

## Prerequisites

- Node.js 18+
- pnpm 9.15.4+ (`npm install -g pnpm`)
- Git
- GitHub account (for authentication)

## Initial Setup

1. **Clone and Setup**

   ```bash
   # Clone using degit (recommended)
   pnpm dlx degit your-org/tanstack-boilerplate my-project
   cd my-project

   # Run the setup script (sets up env, git, dependencies, and database)
   node scripts/setup.js
   ```

   The setup script will:

   - Initialize git repository
   - Create .env from template
   - Generate secure session secret
   - Install dependencies
   - Set up local SQLite database

2. **Environment Configuration**

   After running setup, configure these variables in `.env`:

   ```bash
   # App (Required)
   APP_NAME=tanstack-boilerplate
   APPLICATION_URL=http://localhost:3000
   SESSION_SECRET=           # Auto-generated by setup, must be at least 32 chars

   # Database (Local Development)
   LOCAL_DATABASE_PATH=db.sqlite    # Local SQLite path

   # Database (Production)
   TURSO_DATABASE_URL=             # Only needed in production
   TURSO_AUTH_TOKEN=              # Only needed in production

   # Authentication (at least one provider required)
   GITHUB_CLIENT_ID=              # GitHub OAuth App Client ID
   GITHUB_CLIENT_SECRET=          # GitHub OAuth App Secret
   DISCORD_CLIENT_ID=             # Discord App Client ID
   DISCORD_CLIENT_SECRET=         # Discord App Secret

   # Email (Optional)
   RESEND_API_KEY=               # Resend API key for emails
   EMAIL_FROM=email@example.com  # Sender email address

   # Admin Access (Optional)
   ADMIN_USER_EMAILS=admin@example.com  # Comma-separated list of admin emails

   # Logging (Optional)
   LOG_LEVEL=info                # Default: info
   ```

3. **Database Setup**

   ```bash
   pnpm db:migrate   # Run migrations
   pnpm db:seed     # Seed initial data
   ```

   > Note: Local development uses SQLite file directly, while production uses
   > Turso. See deployment docs for production setup.

## Development Scripts

### Core Development

- `pnpm dev` - Start development server
- `pnpm dev:mocks` - Start with mock data
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Database

- `pnpm db:migrate` - Run pending migrations
- `pnpm db:generate` - Generate new migration
- `pnpm db:studio` - Open database UI
- `pnpm db:reset` - Clear DB, run migrations, seed data
- `pnpm db:seed` - Seed development data

### Testing

- `pnpm test` - Run unit tests
- `pnpm test:coverage` - Run tests with coverage
- `pnpm test:e2e:run` - Run E2E tests
- `pnpm test:e2e:install` - Install E2E test dependencies

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript checks
- `pnpm verify` - Run all checks (lint, type, test)

### Internationalization

- `pnpm i18n-check` - Check translations
- `pnpm i18n-auto-translate` - Auto-translate missing strings

### Additional Tools

- `pnpm dev:email` - Start email preview server
- `pnpm dev:trigger` - Start trigger.dev development

## Development Flow

1. Create a new branch for your feature
2. Run `pnpm dev` to start the development server
3. Make your changes following the project guidelines
4. Run `pnpm verify` before committing
5. Create a pull request