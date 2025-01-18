# Tanstack Boilerplate (WIP)

This is a personal boilerplate to jumpstart new projects.

**It's node only and will not work for serverless deployments, as this requires
a long running server for things like cron jobs and sockets.**

For the app to work, the following environment variables need to be set:

```env
APPLICATION_URL=https://localhost:3000
SESSION_SECRET=
REDIS_URL=

# Optional (one sso provider is required):
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
```

## Already done

- Tanstack Start, Router, Query
- Shadcn UI
- Tailwind CSS
- Light & Dark mode (next-themes <- yes this works here too, as its not using
  next specific APIs)
- Better Auth (sso, rbac, etc.)
- Simple onboarding flow after first signup (to set name)
- SQLite
- Drizzle ORM
- Emails (Resend & React Email)
- i18n (use-intl)
- user timezone on server (without flashes)
- Cron jobs & background jobs (BullMQ)
- react hook form (still evaluating if tanstack form could be used instead)
- docker deployment with fly.io (see deployments.md for more info)

## TODO

- [ ] magic links & otp (better auth has this)
- [ ] stripe
- [ ] file uploads
- [ ] notifications
- [ ] data tables example
- [ ] sentry
- [ ] playwright tests
- [ ] proper documentation

## Exploring (not sure if this will be added)

- [ ] feature flags
- [ ] logging
- [ ] analytics

## Development

Clone the repo using degit and run setup:

```bash
pnpm dlx degit EugenEistrach/tanstack-boilerplate my-project
cd my-project
node scripts/setup.js
```

Start the dev server:

```bash
pnpm dev
```
