# Documentação dos Schemas - Omnia System

## 📋 **Visão Geral**

O sistema Omnia utiliza uma arquitetura hierárquica multi-tenant com os seguintes níveis:

- **Users** (usuários base)
- **Workspaces** (espaços de trabalho)
- **Spaces** (espaços dentro de workspaces)
- **Categories** (categorias dentro de spaces)
- **Tasks** (tarefas dentro de categorias)

## 🔗 **Relacionamentos e Cardinalidades**

### **Users (1:N)**

```
Users -> Workspaces (owner_id)     [1 usuário pode possuir N workspaces]
Users -> Spaces (created_by)       [1 usuário pode criar N spaces]
Users -> Categories (owner_id)     [1 usuário pode possuir N categorias]
Users -> Tasks (owner_id)          [1 usuário pode possuir N tasks]
```

### **Many-to-Many Relationships**

```
Users <-> Workspaces (workspace_members)  [N usuários podem estar em N workspaces]
Users <-> Spaces (space_members)          [N usuários podem estar em N spaces]
Users <-> Tasks (task_assignments)        [N usuários podem ser assignados a N tasks]
Tasks <-> Categories (task_categories)    [N tasks podem estar em N categorias]
```

### **Hierarquia Principal**

```
Workspaces -> Spaces -> Categories -> Tasks
     1:N        1:N        1:N
```

## 📊 **Índices Implementados**

### **Users**

- `users_email_idx` - Email (único, para login)
- `users_is_active_idx` - Status ativo
- `users_created_at_idx` - Data de criação

### **Workspaces**

- `workspaces_owner_id_idx` - FK para users
- `workspaces_is_active_idx` - Status ativo
- `workspaces_created_at_idx` - Data de criação
- `workspaces_name_idx` - Nome (para busca)

### **Workspace Members**

- `workspace_members_workspace_id_idx` - FK para workspaces
- `workspace_members_user_id_idx` - FK para users
- `workspace_members_is_active_idx` - Status ativo
- `workspace_members_role_idx` - Função do usuário
- `workspace_members_workspace_active_idx` - Composto (workspace + ativo)
- `workspace_members_user_active_idx` - Composto (user + ativo)
- **UNIQUE**: `workspace_members_user_workspace_unique` (userId + workspaceId)

### **Spaces**

- `spaces_workspace_id_idx` - FK para workspaces
- `spaces_created_by_idx` - FK para users
- `spaces_is_active_idx` - Status ativo
- `spaces_is_private_idx` - Privacidade
- `spaces_name_idx` - Nome (para busca)
- `spaces_workspace_active_idx` - Composto (workspace + ativo)
- `spaces_workspace_sort_idx` - Composto (workspace + ordem)

### **Space Members**

- `space_members_space_id_idx` - FK para spaces
- `space_members_user_id_idx` - FK para users
- `space_members_is_active_idx` - Status ativo
- `space_members_role_idx` - Função do usuário
- `space_members_space_active_idx` - Composto (space + ativo)
- `space_members_user_active_idx` - Composto (user + ativo)
- **UNIQUE**: `space_members_user_space_unique` (userId + spaceId)

### **Categories**

- `categories_space_id_idx` - FK para spaces
- `categories_owner_id_idx` - FK para users
- `categories_name_idx` - Nome (para busca)
- `categories_type_idx` - Tipo da categoria
- `categories_space_type_idx` - Composto (space + tipo)

### **Tasks**

- `tasks_owner_id_idx` - FK para users
- `tasks_category_id_idx` - FK para categories
- `tasks_status_idx` - Status da task
- `tasks_priority_idx` - Prioridade
- `tasks_is_active_idx` - Status ativo
- `tasks_name_idx` - Nome (para busca)
- `tasks_created_at_idx` - Data de criação
- `tasks_started_at_idx` - Data de início
- `tasks_ends_at_idx` - Data de fim
- `tasks_category_status_idx` - Composto (categoria + status)
- `tasks_owner_status_idx` - Composto (proprietário + status)
- `tasks_category_sort_idx` - Composto (categoria + ordem)

### **Task Assignments**

- `task_assignments_task_id_idx` - FK para tasks
- `task_assignments_user_id_idx` - FK para users
- `task_assignments_is_active_idx` - Status ativo
- `task_assignments_assigned_at_idx` - Data de assignment
- `task_assignments_task_active_idx` - Composto (task + ativo)
- `task_assignments_user_active_idx` - Composto (user + ativo)
- **UNIQUE**: `task_assignments_unique_active` (taskId + userId + isActive)

### **Task Categories**

- `task_categories_task_id_idx` - FK para tasks
- `task_categories_category_id_idx` - FK para categories
- `task_categories_created_at_idx` - Data de criação
- **PRIMARY KEY**: Composta (taskId + categoryId)

## 🔒 **Constraints de Integridade**

### **Unique Constraints**

1. **users.email** - Um email por usuário
2. **workspace_members(user_id, workspace_id)** - Um usuário uma vez por workspace
3. **space_members(user_id, space_id)** - Um usuário uma vez por space
4. **task_assignments(task_id, user_id, is_active)** - Um assignment ativo por task/user
5. **task_categories(task_id, category_id)** - Uma relação por task/categoria

### **Foreign Key Constraints**

Todas as relações têm constraints de integridade referencial:

- `ON DELETE` padrão (RESTRICT)
- `ON UPDATE` padrão (CASCADE)

## 🚀 **Queries Otimizadas**

### **Buscar membros ativos de um workspace**

```sql
SELECT u.*, wm.role
FROM users u
JOIN workspace_members wm ON u.id = wm.user_id
WHERE wm.workspace_id = $1 AND wm.is_active = true;
-- Usa: workspace_members_workspace_active_idx
```

### **Buscar tasks por categoria e status**

```sql
SELECT * FROM tasks
WHERE category_id = $1 AND status = $2 AND is_active = true;
-- Usa: tasks_category_status_idx
```

### **Buscar spaces públicos de um workspace**

```sql
SELECT * FROM spaces
WHERE workspace_id = $1 AND is_private = false AND is_active = true;
-- Usa: spaces_workspace_active_idx + spaces_is_private_idx
```

## 📈 **Performance Considerations**

### **Índices Compostos**

- Criados para queries mais comuns
- Ordem dos campos otimizada para consultas típicas
- Reduzem necessidade de múltiplos índices separados

### **Soft Delete**

- Todos os entities principais usam `is_active`
- Permite histórico sem deletar dados
- Índices incluem `is_active` para performance

### **Timestamps**

- Indexados para ordenação e filtragem
- `created_at` em todas as tabelas principais
- `updated_at` para auditoria

## 🔧 **Comandos de Migração**

Para aplicar as mudanças:

```bash
# Gerar migrações
pnpm db:generate

# Aplicar migrações
pnpm db:migrate

# Ou push direto (desenvolvimento)
pnpm db:push
```

## 📝 **Notas de Implementação**

1. **Relacionamentos Explícitos**: Definidos em arquivo separado para evitar dependências circulares
2. **Casing**: Configurado para `snake_case` no banco
3. **UUIDs**: Usados como chaves primárias para facilitar distribuição
4. **JSONB**: Para campos de metadados flexíveis (settings, permissions, etc.)
5. **Drizzle ORM**: Configurado com schema completo para type safety
