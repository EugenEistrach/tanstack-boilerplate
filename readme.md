# et-stack

A comprehensive boilerplate project to jumpstart new React applications with
modern tooling and best practices.

## Features

- 🤖 Cursor-ready with predefined `.cursor/rules` for AI-assisted development
- 🔒 Type-safe full-stack development with [TanStack](https://tanstack.com)
- 🔑 Modern authentication with [better-auth](https://better-auth.com)
- 💾 Database integration with [Drizzle ORM](https://orm.drizzle.team)
- 🎨 Beautiful UI with [shadcn/ui](https://ui.shadcn.com)
- 🌍 Tree-shakeable i18n with
  [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)
- 🧪 Comprehensive testing setup

## Tech Stack

- **Tech Stack**

  - [React 19](https://react.dev)
  - [TanStack](https://tanstack.com) ([Router](https://tanstack.com/router),
    [Query](https://tanstack.com/query), [Start](https://tanstack.com/start))
  - [TailwindCSS](https://tailwindcss.com) with
    [shadcn/ui](https://ui.shadcn.com)
  - [Better-auth](https://better-auth.com) with [GitHub](https://github.com)
  - [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for
    type-safe i18n
  - [arktype](https://arktype.io) for type-safe validation

- **Backend & Data**

  - [SQLite](https://sqlite.org) (local) / [Turso](https://turso.tech)
    (production) with [Drizzle ORM](https://orm.drizzle.team)

  - [trigger.dev](https://trigger.dev) for background jobs (optional,
    self-hosted or cloud)
  - [Fly.io](https://fly.io) for deployment and hosting

- **Testing & Quality**

  - [vitest](https://vitest.dev) for testing
  - [ESLint](https://eslint.org) + [Prettier](https://prettier.io)
  - [Playwright](https://playwright.dev) for E2E testing

## Quick Start

```bash
wip
```

## Database Setup

This boilerplate uses a hybrid database approach:

- **Local Development**:

  - Direct SQLite file for simplicity and zero-config setup
  - Built-in management UI via `pnpm db:studio`

- **Production**:
  - [Turso](https://turso.tech) - Distributed SQLite database
  - Global data distribution with minimal latency
  - Embedded database in Fly.io for super fast reads

## Documentation

- [Project Structure](.cursor/project-structure.mdc) - Overview of the project
  structure
- [API Guidelines](.cursor/api-layer.mdc) - API development and integration
- [Client Guidelines](.cursor/rules/client.mdc) - UI development
- [Server Guidelines](.cursor/rules/server.mdc) - Server-side development
- [Testing Guidelines](.cursor/rules/testing.mdc) - Testing practices
- [Validation Guidelines](.cursor/rules/validation.mdc) - Data validation
- [Routing Guidelines](.cursor/rules/routing.mdc) - Route creation and
  navigation
- [i18n Guide](.cursor/rules/i18n.mdc) - Internationalization
- [Commit Conventions](.cursor/rules/commit-conventions.mdc) - Git practices

## License

[License](license.md)
