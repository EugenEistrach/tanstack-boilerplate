# Database Schema Conventions

## Structure

- `src/drizzle/schemas/` - All database schemas
  - `_exports.ts` - Exports all schemas for drizzle-kit
  - `schema.ts` - Combines all tables into a single schema object
  - `[feature]-schema.ts` - Individual feature schemas

## Creating New Schemas

1. Create schema file `[feature]-schema.ts`:

   ```ts
   import { sqliteTable } from 'drizzle-orm/sqlite-core'
   import { dateTableFields, textId } from '@/drizzle/table-fields'

   export const FeatureTable = sqliteTable('feature_name', {
   	id: textId(),
   	// ... other fields
   	...dateTableFields,
   })

   export type Feature = typeof FeatureTable.$inferSelect
   ```

2. Add to `_exports.ts`:

   ```ts
   export * from './feature-schema'
   ```

3. Add to `schema.ts`:

   ```ts
   import * as featureSchema from './feature-schema'

   export const schema = {
   	// ... other tables
   	feature: featureSchema.FeatureTable,
   } as const
   ```

## Naming Conventions

- Table names: lowercase with underscores
- Schema files: kebab-case with `-schema` suffix
- Table exports: PascalCase with `Table` suffix
- Type exports: PascalCase matching table name without suffix
