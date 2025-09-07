# Fluxo de Login e Registro

## Autenticação JWT

**Token Storage**: Cookie HTTP-only (`token`)

- **Expiração**: 1 hora
- **Secure**: Apenas em produção
- **SameSite**: Strict

## Validações

### Login

- **Email**: Formato válido, obrigatório
- **Password**: 6-100 caracteres, obrigatório

### Registro

- **Nome**: 2-100 caracteres, obrigatório
- **Email**: Formato válido, único, obrigatório
- **Password**: 6-100 caracteres, obrigatório
- **Confirm Password**: Deve coincidir com password
- **Terms**: Aceitação obrigatória

## Fluxo de Autenticação

### Login

1. Validação client-side (Zod)
2. POST `/api/login`
3. Verificação credenciais (bcrypt)
4. Geração JWT token
5. Cookie HTTP-only
6. Redirect para dashboard

### Registro

1. Validação client-side (Zod)
2. POST `/api/create-user`
3. Hash password (bcrypt, salt 10)
4. Persistência no banco
5. Redirect para login

## Middleware Protection

**Rotas Protegidas**: Todas exceto públicas
**Rotas Públicas**: `/login`, `/register`, `/api/*`, `/terms`, `/privacy`

**Verificações**:

- Presença do token
- Expiração do token
- Redirect automático para login

## Segurança

- **Password Hashing**: bcrypt com salt 10
- **JWT Secret**: Environment variable
- **Cookie Security**: HTTP-only, secure em produção
- **Token Expiration**: 1 hora
- **SameSite Protection**: Strict

## Estados de Erro

### Erros de Login

- `User not found`
- `Invalid password`

### Erros de Registro

- `Email already exists`
- Validações de campo específicas

## Hooks Utilizados

- `useRouter` (Next.js) para navegação
- `useState` para gerenciamento de estado local
- Validação síncrona com Zod

## Componentes UI

- **shadcn/ui**: Card, Button, Input, Checkbox
- **Lucide Icons**: Eye, EyeOff, Lock, Mail
- **Tailwind CSS**: Estilização responsiva
