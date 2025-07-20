## Criando instruções para a criação do schema de banco de dados e consiguração do drizzle

## Arquitetura de pastas do sistema

```
Omnia utiliza uma arquitetura de pastas organizada para facilitar o desenvolvimento e a manutenção do código. A estrutura é a seguinte:

estrutura do server-side:

src/
├── server / # Código do servidor
│   ├── database / # Configuração do banco de dados
│   │   ├── schemas / # Schemas do banco de dados
│   │   ├── index.ts / # export de todos os schemas
drizzle.config.ts / # Configuração do Drizzle ORM

``` 
## 🗂 **Schemas do Banco de Dados**

 Cada schema é definido em um arquivo separado dentro da pasta `schemas`. Os schemas são organizados de acordo com as entidades do sistema, como `users`, `workspaces`, `spaces`, `categories` e `tasks`.

 Cada entendidade possui suas próprias relações e cardinalidades, definidas de acordo com a arquitetura do sistema.

 exemplo de schema de um usuário:
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

O schema de um usuário define os campos básicos, como `id`, `email`, `name`, `isActive`, `createdAt` e `updatedAt`. Além disso, as relações com outras entidades são definidas através de chaves estrangeiras.

exemplos de relações e cardinalidades:
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

export const workspaceRelations = pgTable(workspace,(many)=>({
    owner: relation(users, {
        fields: [workspace.ownerId],
        references: [users.id],
    }),
    spaces: relation(spaces, {
        fields: [workspace.id],
        references: [spaces.workspaceId],
    }),
    }));
}) );

```

Sempre deve haver uma relação entre as entidades, como `users` e `workspaces`, onde um usuário pode ser o proprietário de um workspace, e um workspace pode ter vários espaços associados.

Caso não seja informado o tipo de relação deve-se primeiro perguntar ao usuário se é uma relação de 1:N ou N:N, e então criar a relação adequada.

Com essa base de schemas e relações, o Drizzle ORM pode ser configurado para gerar as tabelas no banco de dados e permitir consultas eficientes entre as entidades.

Ao criar novos schemas, é importante seguir o padrão de nomenclatura e estrutura para garantir a consistência do código e facilitar a manutenção futura.

Deve-se sempre validar as relações e cardinalidades antes de implementar novas funcionalidades, garantindo que o modelo de dados esteja alinhado com os requisitos do sistema.

Ao final rode pnpm run db:push para aplicar as alterações no banco de dados.

