# Mapa de Cardinalidades - Omnia System

## 📊 **Diagrama de Relacionamentos**

```
┌─────────────┐
│    Users    │
└─────┬───────┘
      │
      ├─ 1:N ─┐ ownedWorkspaces
      │       ▼
      │   ┌────────────┐    1:N    ┌─────────┐
      │   │ Workspaces ├─────────►│ Spaces  │
      │   └────┬───────┘           └────┬────┘
      │        │                        │
      │        │ 1:N                    │ 1:N
      │        ▼                        ▼
      │   ┌─────────────────┐      ┌────────────┐    1:N    ┌───────┐
      │   │WorkspaceMembers │      │Categories  ├─────────►│ Tasks │
      │   └─────────────────┘      └────────────┘           └───┬───┘
      │        ▲                        ▲                      │
      │        │ N:N                    │ 1:N                  │ 1:N
      │        │                        │                      ▼
      │        │                        │                 ┌─────────────────┐
      │        │                        │                 │ TaskAssignments │
      │        │                        │                 └─────────────────┘
      │        │                        │                      ▲
      │        │                        │                      │ N:N
      └────────┘                        └──────────────────────┘
               │                                               │
               └─ N:N ─┐ spaceMemberships                     │
                       ▼                                       │
                  ┌──────────────┐                           │
                  │ SpaceMembers │                           │
                  └──────────────┘                           │
                       ▲                                       │
                       │ N:N                                  │
                       └──────────────────────────────────────┘
```

## 🔗 **Cardinalidades Detalhadas**

### **1. Relacionamentos Diretos (1:N)**

#### **Users -> Workspaces** (Owner)

- **Cardinalidade**: 1:N
- **Descrição**: Um usuário pode possuir vários workspaces
- **FK**: `workspaces.owner_id -> users.id`
- **Relação**: `users.ownedWorkspaces` / `workspaces.owner`

#### **Workspaces -> Spaces**

- **Cardinalidade**: 1:N
- **Descrição**: Um workspace pode ter vários spaces
- **FK**: `spaces.workspace_id -> workspaces.id`
- **Relação**: `workspaces.spaces` / `spaces.workspace`

#### **Users -> Spaces** (Creator)

- **Cardinalidade**: 1:N
- **Descrição**: Um usuário pode criar vários spaces
- **FK**: `spaces.created_by -> users.id`
- **Relação**: `users.createdSpaces` / `spaces.creator`

#### **Spaces -> Categories**

- **Cardinalidade**: 1:N
- **Descrição**: Um space pode ter várias categorias
- **FK**: `categories.space_id -> spaces.id`
- **Relação**: `spaces.categories` / `categories.space`

#### **Users -> Categories** (Owner)

- **Cardinalidade**: 1:N
- **Descrição**: Um usuário pode possuir várias categorias
- **FK**: `categories.owner_id -> users.id`
- **Relação**: `users.ownedCategories` / `categories.owner`

#### **Categories -> Tasks** (Primary Category)

- **Cardinalidade**: 1:N
- **Descrição**: Uma categoria pode ter várias tasks como categoria principal
- **FK**: `tasks.category_id -> categories.id`
- **Relação**: `categories.primaryTasks` / `tasks.primaryCategory`

#### **Users -> Tasks** (Owner)

- **Cardinalidade**: 1:N
- **Descrição**: Um usuário pode possuir várias tasks
- **FK**: `tasks.owner_id -> users.id`
- **Relação**: `users.ownedTasks` / `tasks.owner`

### **2. Relacionamentos Many-to-Many (N:N)**

#### **Users <-> Workspaces** (via workspace_members)

- **Cardinalidade**: N:N
- **Descrição**: Usuários podem pertencer a vários workspaces e workspaces podem ter vários usuários
- **Tabela de Junção**: `workspace_members`
- **Campos**: `user_id`, `workspace_id`, `role`, `permissions`
- **Constraint**: UNIQUE(`user_id`, `workspace_id`)
- **Relações**:
  - `users.workspaceMemberships` / `workspaceMembers.user`
  - `workspaces.members` / `workspaceMembers.workspace`

#### **Users <-> Spaces** (via space_members)

- **Cardinalidade**: N:N
- **Descrição**: Usuários podem pertencer a vários spaces e spaces podem ter vários usuários
- **Tabela de Junção**: `space_members`
- **Campos**: `user_id`, `space_id`, `role`, `permissions`
- **Constraint**: UNIQUE(`user_id`, `space_id`)
- **Relações**:
  - `users.spaceMemberships` / `spaceMembers.user`
  - `spaces.members` / `spaceMembers.space`

#### **Users <-> Tasks** (via task_assignments)

- **Cardinalidade**: N:N
- **Descrição**: Usuários podem ser assignados a várias tasks e tasks podem ter vários usuários assignados
- **Tabela de Junção**: `task_assignments`
- **Campos**: `user_id`, `task_id`, `assigned_at`, `is_active`
- **Constraint**: UNIQUE(`user_id`, `task_id`, `is_active`)
- **Relações**:
  - `users.taskAssignments` / `taskAssignments.user`
  - `tasks.assignments` / `taskAssignments.task`

#### **Tasks <-> Categories** (via task_categories)

- **Cardinalidade**: N:N
- **Descrição**: Tasks podem estar em várias categorias e categorias podem ter várias tasks
- **Tabela de Junção**: `task_categories`
- **Campos**: `task_id`, `category_id`, `created_at`
- **Primary Key**: Composta (`task_id`, `category_id`)
- **Relações**:
  - `tasks.taskCategories` / `taskCategories.task`
  - `categories.taskCategories` / `taskCategories.category`

## 🎯 **Casos de Uso das Cardinalidades**

### **Consultas Hierárquicas**

```typescript
// Buscar todos os spaces de um workspace
const workspaceWithSpaces = await db.query.workspaces.findFirst({
  where: eq(workspaces.id, workspaceId),
  with: {
    spaces: true,
  },
});

// Buscar todas as categorias de um space
const spaceWithCategories = await db.query.spaces.findFirst({
  where: eq(spaces.id, spaceId),
  with: {
    categories: true,
  },
});
```

### **Consultas de Membership**

```typescript
// Buscar todos os workspaces de um usuário
const userWorkspaces = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    workspaceMemberships: {
      with: {
        workspace: true,
      },
    },
  },
});

// Buscar membros ativos de um workspace
const workspaceMembers = await db.query.workspaces.findFirst({
  where: eq(workspaces.id, workspaceId),
  with: {
    members: {
      where: eq(workspaceMembers.isActive, true),
      with: {
        user: true,
      },
    },
  },
});
```

### **Consultas de Tasks**

```typescript
// Buscar tasks de um usuário com assignments
const userTasks = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    // Tasks que o usuário possui
    ownedTasks: true,
    // Tasks assignadas ao usuário
    taskAssignments: {
      where: eq(taskAssignments.isActive, true),
      with: {
        task: true,
      },
    },
  },
});

// Buscar uma task com todas as categorias
const taskWithCategories = await db.query.tasks.findFirst({
  where: eq(tasks.id, taskId),
  with: {
    // Categoria principal
    primaryCategory: true,
    // Todas as categorias via many-to-many
    taskCategories: {
      with: {
        category: true,
      },
    },
  },
});
```

## 🔒 **Regras de Integridade**

### **Constraints Únicos**

1. **Workspace Membership**: Um usuário só pode estar uma vez em cada workspace
2. **Space Membership**: Um usuário só pode estar uma vez em cada space
3. **Task Assignment**: Um usuário só pode ter um assignment ativo por task
4. **Task Categories**: Uma task só pode estar uma vez em cada categoria

### **Soft Delete**

- Todas as tabelas principais usam `is_active` para soft delete
- Memberships preservam histórico com `joined_at`/`unassigned_at`
- Permite auditoria completa sem perda de dados

### **Cascading Rules**

- **Workspace deleted** → Members become inactive (soft delete)
- **Space deleted** → Members become inactive, Categories remain
- **User deleted** → Owned entities transfer ownership, Memberships inactive
- **Task deleted** → Assignments become inactive, Categories unlinked

## 📈 **Performance Considerations**

### **Índices Otimizados**

- Todos os FKs têm índices dedicados
- Índices compostos para consultas comuns (workspace+active, category+status)
- Índices para campos de busca (name, email, status)

### **Query Patterns**

- Use `with` para relacionamentos aninhados
- Prefira consultas com `where` nos relacionamentos
- Use `limit` em relacionamentos many para controlar tamanho da resposta

Este mapa garante integridade referencial completa e permite queries eficientes em toda a hierarquia do sistema!
