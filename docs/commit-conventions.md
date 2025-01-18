# Commit Message Conventions

We follow a structured approach to commit messages to maintain a clean and
meaningful git history.

## Message Structure

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

## Types

- `feat`: New features (e.g., "feat(auth): Add SSO support")
- `fix`: Bug fixes (e.g., "fix(api): Handle timeout errors")
- `docs`: Documentation changes (e.g., "docs: Update API endpoints")
- `style`: Code style/formatting (e.g., "style: Format with prettier")
- `refactor`: Code refactoring (e.g., "refactor(db): Extract config")
- `test`: Changes to tests (e.g., "test: Add auth unit tests")
- `chore`: Maintenance tasks (e.g., "chore(deps): Bump versions")

## Best Practices

### Subject Line

- Use imperative mood ("Add" not "Added")
- Keep it under 50 characters
- Don't end with period
- Start with capital letter

### Examples

#### Feature Addition

`feat(users): Add password reset functionality`

#### Bug Fix

`fix(auth): Resolve token expiration issue`

#### Database Refactoring

```
refactor(database): Split reports table to separate raw payload storage

- Move raw payloads to new raw_reports table
- Maintain data relationship for re-running imports
- Improve schema organization by decoupling storage concerns
```

#### Dependency Updates

```
chore(deps): Bump package versions
```

## Breaking Changes

For breaking changes, add `!` after type/scope and include BREAKING CHANGE in
body:

````
feat(api)!: Change authentication flow

BREAKING CHANGE: New token format is incompatible with old clients ```
````