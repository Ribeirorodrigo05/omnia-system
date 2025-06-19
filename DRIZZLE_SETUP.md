# Drizzle ORM + Neon Database Setup

Este projeto usa Drizzle ORM com Neon Database para gerenciamento de dados.

## Configuração

### 1. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

### 2. Configurar o Neon Database

1. Acesse [Neon Console](https://console.neon.tech/)
2. Crie um novo projeto
3. Copie a connection string
4. Cole no arquivo `.env.local` na variável `DATABASE_URL`

### 3. Gerar e executar migrações

```bash
# Gerar arquivos de migração baseados no schema
pnpm db:generate

# Executar migrações no banco
pnpm db:migrate

# Ou para desenvolvimento, push direto do schema (sem migrações)
pnpm db:push
```

### 4. Visualizar banco de dados

```bash
# Abrir Drizzle Studio
pnpm db:studio
```

## Estrutura de Arquivos

```
lib/db/
├── index.ts          # Configuração da conexão
├── schema.ts         # Definição das tabelas
└── migrations/       # Arquivos de migração (gerados automaticamente)
```

## Scripts Disponíveis

- `pnpm db:generate` - Gera migrações baseado no schema
- `pnpm db:migrate` - Executa migrações pendentes
- `pnpm db:push` - Push do schema diretamente (desenvolvimento)
- `pnpm db:studio` - Abre interface visual do banco

## Exemplos de Uso

### Consultar dados

```typescript
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const allUsers = await db.select().from(users);
```

### Inserir dados

```typescript
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const newUser = await db
  .insert(users)
  .values({
    name: "John Doe",
    email: "john@example.com",
    password: "hashedPassword",
  })
  .returning();
```

### Consultar com filtros

```typescript
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const user = await db
  .select()
  .from(users)
  .where(eq(users.email, "john@example.com"))
  .limit(1);
```

## Recursos

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Neon Database Docs](https://neon.tech/docs)
- [Zod Validation](https://zod.dev/)
