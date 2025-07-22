## Creating instructions for database schema creation and Drizzle configuration

## System folder architecture

```
Omnia uses an organized folder architecture to facilitate code development and maintenance. The structure is as follows:

server-side structure:

src/
├── server / # Server code
│   ├── database / # Database configuration
│   │   ├── schemas / # Database schemas
│   │   ├── index.ts / # export of all schemas
drizzle.config.ts / # Drizzle ORM configuration

``` 
## 🗂 **Database Schemas**

Each schema is defined in a separate file within the `schemas` folder. Schemas are organized according to system entities, such as `users`, `workspaces`, `spaces`, `categories` and `tasks`.

Each entity has its own relationships and cardinalities, defined according to the system architecture.

Example of a user schema:
```typescript
// src/server/database/schemas/users.ts
import { pgTable, serial, text, boolean, timestamp, primaryKey, relation } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  isActive: boolean('is-active').default(true),
  createdAt: timestamp('created-at').defaultNow(),
  updatedAt: timestamp('updated-at').defaultNow().onUpdateNow(),
});
```

The user schema defines basic fields such as `id`, `email`, `name`, `isActive`, `createdAt` and `updatedAt`. Additionally, relationships with other entities are defined through foreign keys.

Examples of relationships and cardinalities:
```typescript
// src/server/database/schemas/workspaces.ts

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const workspaces = pgTable('workspaces', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  isActive: boolean('is-active').default(true),
  createdAt: timestamp('created-at').defaultNow(),
  updatedAt: timestamp('updated-at').defaultNow().onUpdateNow(),
  ownerId: uuid('owner-id').notNull(),
},
    (table) => [
    index("workspaces_name_idx").on(table.name),
    uniqueIndex("workspaces_owner_id_idx").on(table.ownerId),
    index("workspaces_is_active_idx").on(table.isActive),
]);

export const workspaceRelations = relations(workspaces, ({ one, many }) => ({
    owner: one(users, {
        fields: [workspaces.ownerId],
        references: [users.id],
    }),
    spaces: many(spaces),
}));
```

There must always be a relationship between entities, such as `users` and `workspaces`, where a user can be the owner of a workspace, and a workspace can have several associated spaces.

If the relationship type is not specified, you should first ask the user if it's a 1:N or N:N relationship, and then create the appropriate relationship.

With this base of schemas and relationships, Drizzle ORM can be configured to generate tables in the database and allow efficient queries between entities.

When creating new schemas, it's important to follow the naming pattern and structure to ensure code consistency and facilitate future maintenance.

You should always validate relationships and cardinalities before implementing new features, ensuring that the data model is aligned with system requirements.

At the end, run `pnpm run db:push` to apply changes to the database.

