# API de Autenticação - Exemplos de Uso

Este documento contém exemplos de como usar as APIs de registro e autenticação via curl.

## Configuração Necessária

Certifique-se de que as seguintes variáveis de ambiente estão configuradas no arquivo `.env`:

```env
DATABASE_URL=your_database_url_here
JWT_SECRET=your_jwt_secret_here
```

## 1. Registro de Usuário

### Endpoint

```
POST /api/users
```

### Exemplo de Requisição

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123456"
  }'
```

### Resposta de Sucesso (201)

```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "cm7abc123...",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "createdAt": "2024-01-20T10:30:00.000Z",
    "isActive": true
  }
}
```

### Possíveis Erros

#### Email já existe (400)

```json
{
  "error": "Email já está em uso",
  "code": "EMAIL_ALREADY_EXISTS"
}
```

#### Dados inválidos (400)

```json
{
  "error": "Dados de entrada inválidos",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

## 2. Autenticação de Usuário

### Endpoint

```
POST /api/auth
```

### Exemplo de Requisição

```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senha123456"
  }'
```

### Resposta de Sucesso (200)

```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm7abc123...",
    "name": "João Silva",
    "email": "joao@exemplo.com"
  },
  "expiresIn": "1h",
  "tokenType": "Bearer"
}
```

### Possíveis Erros

#### Credenciais inválidas (401)

```json
{
  "error": "Credenciais inválidas",
  "code": "INVALID_CREDENTIALS"
}
```

#### Conta desativada (401)

```json
{
  "error": "Conta desativada",
  "code": "ACCOUNT_DEACTIVATED"
}
```

#### Dados inválidos (400)

```json
{
  "error": "Dados de entrada inválidos",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

## 3. Usando o Token JWT

Depois de fazer login, você pode usar o token JWT recebido para autenticar outras requisições:

```bash
curl -X GET http://localhost:3000/api/protected-route \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 4. Payload do JWT

O token JWT contém as seguintes informações:

- `id`: ID único do usuário
- `email`: Email do usuário
- `name`: Nome do usuário
- `exp`: Timestamp de expiração (1 hora após criação)
- `iss`: Issuer (omnia-system)
- `aud`: Audience (omnia-users)

## 5. Exemplos de Teste Completo

### Fluxo de Registro + Login

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@teste.com",
    "password": "senhaSegura123"
  }'

# 2. Fazer login
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@teste.com",
    "password": "senhaSegura123"
  }'
```

### Teste de Erro - Email Duplicado

```bash
# Registrar primeiro usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro Oliveira",
    "email": "pedro@teste.com",
    "password": "senha123"
  }'

# Tentar registrar com o mesmo email (deve falhar)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro Dois",
    "email": "pedro@teste.com",
    "password": "outrasenha123"
  }'
```

### Teste de Erro - Credenciais Inválidas

```bash
# Tentar login com senha errada
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@teste.com",
    "password": "senhaErrada"
  }'
```

## Notas de Segurança

1. **Passwords**: São hasheadas com bcrypt usando 12 salt rounds
2. **JWT**: Expira em 1 hora para limitar exposição
3. **Validação**: Todos os dados de entrada são validados com Zod
4. **Logs**: Não incluem dados sensíveis como senhas ou tokens
5. **Erros**: Não expõem informações internas do sistema
6. **HTTPS**: Em produção, sempre usar HTTPS para proteger os dados em trânsito
