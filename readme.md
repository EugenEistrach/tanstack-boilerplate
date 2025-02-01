# TanStack Boilerplate

A comprehensive boilerplate project to jumpstart new React applications with
modern tooling and best practices.

## Features

- 🤖 Cursor-ready with predefined `.cursor/rules` for AI-assisted development
- 🔒 Type-safe full-stack development with [TanStack](https://tanstack.com)
- 🔑 Modern authentication with [GitHub](https://github.com) SSO
- 💾 Database integration with [Drizzle ORM](https://orm.drizzle.team)
- 🎨 Beautiful UI with [shadcn/ui](https://ui.shadcn.com)
- 🌍 Tree-shakeable i18n with
  [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)
- 🧪 Comprehensive testing setup

## Tech Stack

- **Frontend**

  - [React 19](https://react.dev)
  - [TanStack](https://tanstack.com) ([Router](https://tanstack.com/router),
    [Query](https://tanstack.com/query), [Start](https://tanstack.com/start))
  - [TailwindCSS](https://tailwindcss.com) with
    [shadcn/ui](https://ui.shadcn.com)
  - [TypeScript](https://typescriptlang.org)
  - [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for
    type-safe i18n

- **Backend & Data**

  - [SQLite](https://sqlite.org) (local) / [Turso](https://turso.tech)
    (production) with [Drizzle ORM](https://orm.drizzle.team)
  - [Better-auth](https://better-auth.com) with
    [GitHub](https://github.com)/[Discord](https://discord.com) SSO
  - [trigger.dev](https://trigger.dev) for background jobs
  - [Fly.io](https://fly.io) for deployment and hosting

- **Testing & Quality**

  - [vitest](https://vitest.dev) for testing
  - [arktype](https://arktype.io) for type-safe validation
  - [ESLint](https://eslint.org) + [Prettier](https://prettier.io)
  - [Playwright](https://playwright.dev) for E2E testing

## Quick Start

See [Local Development Guide](docs/local-development.md) for detailed setup
instructions.

```bash
# Clone using degit
pnpm dlx degit your-org/tanstack-boilerplate my-project
cd my-project

# Run setup script (env, git, dependencies, database)
tsx scripts/setup.ts

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
