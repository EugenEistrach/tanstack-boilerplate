# Logging Guidelines

Use pino logger for all application logging (except trigger.dev tasks):

```typescript
import { logger } from '@/lib/server/logger.server'

// Correct format - object first, then message
logger.info({ operation: 'updateUser', userId }, 'Operation completed')
logger.error({ operation: 'updateUser', err: err.message }, 'Operation failed')
```

## Rules

1. Logger calls must have at least one argument
2. When using both an object and message:
   - Object must be the first argument
   - Message string must be the second argument
3. For error logging:
   - Must include an `operation` field in the object
   - Use `err` (not `error`) for error properties
4. No `console.log` - use appropriate levels:
   - `error`: Application errors and exceptions
   - `warn`: Warning conditions
   - `info`: General information about system operation
   - `debug`: Detailed information for debugging

## Exception: trigger.dev Tasks

For trigger.dev background tasks, use the logger provided by the trigger.dev
context instead of our application logger. These tasks follow trigger.dev's
logging conventions rather than our application logging rules.
