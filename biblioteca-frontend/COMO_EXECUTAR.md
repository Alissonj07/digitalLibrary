# 🚀 Como Executar o Projeto Biblioteca Digital

## Pré-requisitos
- Node.js 18+ instalado
- API ASP.NET Core rodando na porta 5027

## 📋 Passo a Passo

### 1. Backend (API)
Primeiro, certifique-se de que a API esteja rodando:

```bash
cd BibliotecaDigital
dotnet run
```

A API deve estar disponível em: `http://localhost:5027`

### 2. Frontend (Next.js)
Em um novo terminal, navegue até a pasta do frontend:

```bash
cd biblioteca-frontend
```

### 3. Instalar Dependências (se necessário)
```bash
npm install
```

### 4. Configurar Variáveis de Ambiente
O arquivo `.env.local` já está configurado com:
```
NEXT_PUBLIC_API_URL=http://localhost:5027/api
```

### 5. Executar em Desenvolvimento
```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

### 6. Build para Produção (opcional)
```bash
npm run build
npm start
```

## 🔑 Login de Teste

Para testar o sistema, você precisará:

1. **Criar um usuário via API** (usando Swagger ou Postman):
   - POST `/api/usuario/cadastrar`
   - Body: `{ "email": "admin@teste.com", "senha": "123456", "permissao": "administrador" }`

2. **Fazer login no frontend**:
   - Email: `admin@teste.com`
   - Senha: `123456`

## 📱 Funcionalidades Disponíveis

### Para Todos os Usuários:
- ✅ Dashboard com estatísticas
- ✅ Gerenciar Livros (CRUD completo)
- ✅ Gerenciar Autores (CRUD completo)
- ✅ Gerenciar Empréstimos
- ✅ Proteção de rotas com JWT
- ✅ Logout automático quando token expira

### Para Administradores:
- ✅ Gerenciar Usuários
- ✅ Ver estatísticas completas do sistema

## 🛠️ Tecnologias Utilizadas

### Frontend:
- **Next.js 15** com TypeScript
- **Material-UI (MUI)** para componentes
- **Axios** para requisições HTTP
- **React Hook Form + Yup** para formulários e validação
- **js-cookie** para gerenciamento de cookies
- **JWT** para autenticação

### Recursos Implementados:
- ✅ Autenticação JWT com interceptadores
- ✅ Proteção de rotas baseada em permissões
- ✅ Layout responsivo com navegação lateral
- ✅ Formulários com validação
- ✅ Tratamento de erros
- ✅ Interface moderna e intuitiva

## 🔧 Estrutura do Projeto

```
biblioteca-frontend/
├── src/
│   ├── app/                 # Páginas do Next.js 13+
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── livros/         # Gerenciamento de livros
│   │   ├── autores/        # Gerenciamento de autores
│   │   ├── emprestimos/    # Gerenciamento de empréstimos
│   │   ├── usuarios/       # Gerenciamento de usuários (admin)
│   │   └── login/          # Página de login
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Layout.tsx      # Layout principal com navegação
│   │   └── ProtectedRoute.tsx # Proteção de rotas
│   ├── contexts/           # Context do React
│   │   └── AuthContext.tsx # Gerenciamento de autenticação
│   ├── services/           # Serviços de API
│   │   ├── api.ts          # Configuração do Axios
│   │   └── index.ts        # Serviços das entidades
│   ├── theme/              # Tema do Material-UI
│   └── types/              # Tipos TypeScript
└── .env.local              # Variáveis de ambiente
```

## 🔍 Principais Recursos de Segurança

1. **JWT Token**: Armazenado em localStorage e cookies
2. **Interceptadores**: Adicionam token automaticamente nas requisições
3. **Expiração**: Redirecionamento automático para login quando token expira
4. **Permissões**: Rotas protegidas baseadas no nível de usuário
5. **Validação**: Formulários com validação client-side e server-side

## 📊 Dashboard

O dashboard exibe:
- Total de livros e livros emprestados
- Total de autores cadastrados
- Total de empréstimos ativos
- Total de usuários (apenas para administradores)
- Status geral do sistema
