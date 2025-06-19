# Relations Directory

Esta pasta contém todas as definições de relacionamentos do Drizzle ORM organizadas de forma modular por entidade.

## 📁 **Estrutura**

```
relations/
├── index.ts                 # Centraliza todos os exports
├── users.ts                 # Relacionamentos dos usuários
├── workspaces.ts           # Relacionamentos dos workspaces
├── workspace-members.ts    # Relacionamentos de membros de workspace
├── spaces.ts               # Relacionamentos dos spaces
├── space-members.ts        # Relacionamentos de membros de space
├── categories.ts           # Relacionamentos das categorias
├── tasks.ts                # Relacionamentos das tasks
├── task-assignments.ts     # Relacionamentos de assignments
└── task-categories.ts      # Relacionamentos many-to-many task/category
```

## 🎯 **Benefícios da Estrutura Modular**

### **1. Manutenibilidade**

- **Separação de responsabilidades**: Cada arquivo cuida apenas dos relacionamentos de uma entidade
- **Fácil localização**: Desenvolvedores sabem exatamente onde encontrar/modificar relacionamentos
- **Reduz conflitos**: Múltiplos desenvolvedores podem trabalhar em entidades diferentes sem conflitos

### **2. Escalabilidade**

- **Crescimento controlado**: Novas entidades = novos arquivos, sem impactar os existentes
- **Refatoração segura**: Mudanças em uma entidade não afetam outras
- **Testing isolado**: Cada conjunto de relacionamentos pode ser testado independentemente

### **3. Legibilidade**

- **Arquivos menores**: Mais fácil de ler e entender
- **Contexto claro**: Cada arquivo tem um propósito específico
- **Documentação focada**: Comentários relevantes para cada entidade

## 🔧 **Como Usar**

### **Importar Relacionamentos Específicos**

```typescript
// Importar apenas relacionamentos de usuários
import { usersRelations } from "./relations/users";

// Importar relacionamentos de múltiplas entidades
import { usersRelations, workspacesRelations } from "./relations";
```

### **Importar Todos os Relacionamentos**

```typescript
// Importar tudo de uma vez (via index.ts)
import * as relations from "./relations";

// Ou importar específicos do index
import {
  usersRelations,
  workspacesRelations,
  spacesRelations,
} from "./relations";
```

## 📝 **Convenções**

### **Nomenclatura de Arquivos**

- **Snake-case**: `workspace-members.ts`, `task-assignments.ts`
- **Singular**: Nome da entidade principal no singular
- **Descritivo**: Nome claro da entidade que contém os relacionamentos

### **Nomenclatura de Relações**

- **Descritiva**: `ownedWorkspaces`, `createdSpaces`, `primaryCategory`
- **Direção clara**: `members` (1:N), `memberships` (N:N)
- **Contexto**: `workspace_owner`, `space_creator` para relationName

### **Estrutura dos Arquivos**

```typescript
import { relations } from "drizzle-orm";
import { entityName } from "../entity-name";
import { relatedEntity1 } from "../related-entity1";
import { relatedEntity2 } from "../related-entity2";

// === ENTITY RELATIONS ===
export const entityRelations = relations(entityName, ({ one, many }) => ({
  // N:1 relationships first
  parentEntity: one(relatedEntity1, {
    fields: [entityName.parentId],
    references: [relatedEntity1.id],
    relationName: "descriptive_name",
  }),

  // 1:N relationships
  childEntities: many(relatedEntity2, {
    relationName: "descriptive_name",
  }),

  // N:N relationships via junction tables
  junctionRelations: many(junctionTable, {
    relationName: "descriptive_name",
  }),
}));
```

## 🚀 **Adicionando Nova Entidade**

### **1. Criar arquivo de relacionamentos**

```bash
# Criar novo arquivo
touch relations/nova-entidade.ts
```

### **2. Definir relacionamentos**

```typescript
// relations/nova-entidade.ts
import { relations } from "drizzle-orm";
import { novaEntidade } from "../nova-entidade";
import { entidadeRelacionada } from "../entidade-relacionada";

export const novaEntidadeRelations = relations(
  novaEntidade,
  ({ one, many }) => ({
    // Definir relacionamentos aqui
  })
);
```

### **3. Atualizar index.ts**

```typescript
// relations/index.ts
export { novaEntidadeRelations } from "./nova-entidade";
export * from "./nova-entidade";
```

### **4. Atualizar schema principal**

```typescript
// index.ts
import { novaEntidadeRelations } from "./relations";

export const schema = {
  // ...tabelas existentes,
  novaEntidade,

  // ...relações existentes,
  novaEntidadeRelations,
};
```

## 🔄 **Migration Guide**

Para migrar de um arquivo único para estrutura modular:

1. **Backup**: Salvar arquivo `relations.ts` original
2. **Extract**: Mover cada conjunto de relações para arquivo específico
3. **Import**: Atualizar imports nos arquivos dependentes
4. **Test**: Verificar se todas as relações funcionam
5. **Clean**: Remover arquivo original após validação

Esta estrutura garante que o sistema permaneça organizado e fácil de manter conforme cresce!
