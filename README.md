# Omnia System

Sistema de gerenciamento de workspaces e projetos colaborativos.

## 🚀 Tecnologias

### Frontend

- **Next.js 15.3.4** - React framework com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI acessíveis
- **Lucide React** - Biblioteca de ícones
- **Next Themes** - Gerenciamento de temas

### Backend

- **Next.js API Routes** - API REST
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - Query builder e migrations
- **Neon Database** - PostgreSQL serverless

### Autenticação & Segurança

- **JWT** - Tokens de autenticação
- **bcrypt** - Hashing de senhas
- **Middleware** - Proteção de rotas

### Validação

- **Zod** - Schema validation
- **Drizzle Zod** - Validação de schemas do banco

### Desenvolvimento

- **Biome** - Linter e formatter
- **Turbopack** - Build tool rápido
- **TypeScript** - Compilador

### Testes

- **Vitest** - Framework de testes unitários
- **Playwright** - Testes E2E

## 📁 Estrutura do Projeto

```bash
├── app/                    # Next.js App Router
│   ├── (private)/         # Rotas protegidas
│   ├── (public)/          # Rotas públicas
│   └── api/               # API Routes
├── components/            # Componentes compartilhados
├── lib/                   # Utilitários
├── server/                # Lógica backend
│   ├── database/         # Configuração BD
│   ├── repositories/     # Camada de dados
│   ├── services/         # Lógica de negócio
│   └── validators/       # Validações
└── docs/                 # Documentação
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com Turbopack
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting com Biome
npm run db:generate  # Gerar migrations Drizzle
npm run db:migrate   # Executar migrations
npm run db:push      # Push schema para BD
npm run db:studio    # Interface Drizzle Studio
```

## 📚 Documentação

### Fluxos de Funcionalidade

- [🔐 Fluxo de Login e Registro](./docs/auth-flow.md) - Autenticação JWT, validações e segurança

### Próximas Documentações

- [ ] Gerenciamento de Workspaces
- [ ] Sistema de Spaces e Categories
- [ ] Gerenciamento de Tarefas
- [ ] Sistema de Comentários
- [ ] Integrações e APIs

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Banco de Dados

1. Instalar dependências: `npm install`
2. Configurar DATABASE_URL no .env
3. Gerar schema: `npm run db:generate`
4. Aplicar migrations: `npm run db:migrate`

## 🚀 Deploy

### Vercel (Recomendado)

1. Conectar repositório no Vercel
2. Configurar variáveis de ambiente
3. Deploy automático

### Outros

Compatível com qualquer plataforma que suporte Next.js:

- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
