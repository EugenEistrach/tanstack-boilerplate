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

## SQLite Field Types and Patterns

### Date/Timestamp Fields

```ts
// Use integer with timestamp mode for dates
createdAt: t.integer({ mode: 'timestamp' })
  .notNull()
  .default(sql`(strftime('%s', 'now'))`),
```

### Boolean Fields

```ts
// Use integer with boolean mode
isActive: t.integer({ mode: 'boolean' })
  .notNull()
  .default(sql`0`),
```

### Relations

```ts
// Define foreign keys
userId: t.text().references(() => UserTable.id),

// Define relations
export const tableRelations = relations(Table, ({ one, many }) => ({
  // One-to-many
  posts: many(PostTable),
  // Many-to-one
  user: one(UserTable, {
    fields: [Table.userId],
    references: [UserTable.id],
  }),
}))
```

### Common Patterns

1. Always use `textId()` for primary keys
2. Include `dateTableFields` for created/updated timestamps
3. Use enums with text fields:
   ```ts
   status: t.text({ enum: ['ACTIVE', 'INACTIVE'] }).notNull()
   ```
4. Add relations to schema.ts:
   ```ts
   export const schema = {
   	table: tableSchema.Table,
   	$table: tableSchema.tableRelations,
   } as const
   ```
