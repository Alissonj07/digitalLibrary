# Sistema de Biblioteca Digital - Frontend

Este é o frontend do Sistema de Biblioteca Digital desenvolvido com Next.js, TypeScript e Material-UI.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Linguagem tipada
- **Material-UI (MUI)** - Biblioteca de componentes
- **Axios** - Cliente HTTP para API
- **React Hook Form** - Gerenciamento de formulários
- **Yup** - Validação de esquemas
- **js-cookie** - Gerenciamento de cookies
- **JWT** - Autenticação

## 📋 Funcionalidades

### Autenticação
- ✅ Login com JWT
- ✅ Logout com limpeza de token
- ✅ Proteção de rotas
- ✅ Interceptadores Axios para token automático
- ✅ Redirecionamento em caso de token expirado

### Dashboard
- ✅ Estatísticas do sistema
- ✅ Visão geral dos dados
- ✅ Informações de usuário logado

### Gerenciamento de Livros
- ✅ Listagem de livros
- ✅ Cadastro de novos livros
- ✅ Edição de livros
- ✅ Exclusão de livros
- ✅ Status de empréstimo

### Gerenciamento de Autores
- ✅ Listagem de autores
- ✅ Cadastro de novos autores
- ✅ Edição de autores
- ✅ Exclusão de autores

### Gerenciamento de Empréstimos
- ✅ Listagem de empréstimos
- ✅ Criação de novos empréstimos (Admin)
- ✅ Devolução de livros
- ✅ Status de empréstimo (Em andamento, Atrasado, Devolvido)
- ✅ Cálculo de multas

### Gerenciamento de Usuários (Apenas Administradores)
- ✅ Listagem de usuários
- ✅ Cadastro de novos usuários
- ✅ Controle de permissões (Membro/Administrador)

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- API Backend rodando (ASP.NET Core)

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd biblioteca-frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:
```
NEXT_PUBLIC_API_URL=http://localhost:5027/api
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse o sistema**
- Frontend: http://localhost:3000
- Faça login com um usuário cadastrado no backend
