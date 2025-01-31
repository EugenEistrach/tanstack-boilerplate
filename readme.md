# TanStack Boilerplate

A comprehensive boilerplate project to jumpstart new React applications with
modern tooling and best practices.

## Features

- 🔒 Type-safe full-stack development with TanStack
- 🔑 Modern authentication with GitHub SSO
- 💾 Database integration with Drizzle ORM
- 🎨 Beautiful UI with shadcn/ui
- 🧪 Comprehensive testing setup

## Tech Stack

- **Frontend**

  - React 19
  - TanStack (Router, Query, Start)
  - TailwindCSS with shadcn/ui
  - TypeScript

- **Backend & Data**

  - SQLite (local) / Turso (production) with Drizzle ORM
  - Better-auth with GitHub/Discord SSO
  - trigger.dev for background jobs
  - Fly.io for deployment and hosting

- **Testing & Quality**
  - vitest for testing
  - valibot for type-safe validation
  - ESLint + Prettier
  - playwright for E2E testing

## Quick Start

See [Local Development Guide](docs/local-development.md) for detailed setup
instructions.

```bash
# Clone using degit
pnpm dlx degit your-org/tanstack-boilerplate my-project
cd my-project

# Run setup script (env, git, dependencies, database)
node scripts/setup.js

# Start development server
pnpm dev
```

## Database Setup

This boilerplate uses a hybrid database approach:

- **Local Development**:

  - Direct SQLite file for simplicity and zero-config setup
  - File location: `./data/db.sqlite`
  - Built-in management UI via `pnpm db:studio`

- **Production**:
  - [Turso](https://turso.tech) - Distributed SQLite database
  - Global data distribution with minimal latency
  - Embedded database support for Fly.io deployment
  - See [Deployment Guide](docs/deployments.md) for setup

Both environments use [Drizzle ORM](https://orm.drizzle.team) for type-safe
database operations, ensuring consistent API regardless of environment.

## Documentation

- [Local Development Guide](docs/local-development.md) - Setup and scripts
- [Project Structure](.cursor/project-structure.mdc) - Overview of the project
  structure
- [API Guidelines](.cursor/api-layer.mdc) - API development and integration
- [Client Guidelines](.cursor/rules/client.mdc) - UI development
- [Server Guidelines](.cursor/rules/server.mdc) - Server-side development
- [Testing Guidelines](.cursor/rules/testing.mdc) - Testing practices
- [Validation Guidelines](.cursor/rules/validation.mdc) - Data validation
- [Routing Guidelines](.cursor/rules/routing.mdc) - Route creation and
  navigation
- [Deployment Guide](docs/deployments.md) - Deployment procedures
- [i18n Guide](.cursor/rules/i18n.mdc) - Internationalization
- [Commit Conventions](.cursor/rules/commit-conventions.mdc) - Git practices

## Scripts

See [Local Development Guide](docs/local-development.md) for a complete list of
available scripts.

## License

[License](license.md)
