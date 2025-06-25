import api from './api';
import { Usuario, LoginRequest, Autor, Livro, Emprestimo } from '@/types';

// Serviços de Autenticação
export const authService = {
  async login(credentials: LoginRequest): Promise<string> {
    const response = await api.post('/usuario/login', credentials);
    return response.data; // Token JWT
  },

  async cadastrar(usuario: Omit<Usuario, 'id' | 'criadoEm' | 'multa'>): Promise<Usuario> {
    const response = await api.post('/usuario/cadastrar', usuario);
    return response.data;
  }
};

// Serviços de Usuário
export const usuarioService = {
  async listar(): Promise<Usuario[]> {
    const response = await api.get('/usuario/listar');
    return response.data;
  },

  async buscarPorId(id: number): Promise<Usuario> {
    const response = await api.get(`/usuario/listar/${id}`);
    return response.data;
  }
};

// Serviços de Autor
export const autorService = {
  async listar(): Promise<Autor[]> {
    const response = await api.get('/autor/listar');
    return response.data;
  },

  async buscarPorId(id: number): Promise<Autor> {
    const response = await api.get(`/autor/listar/${id}`);
    return response.data;
  },

  async cadastrar(autor: Omit<Autor, 'id' | 'criadoEm'>): Promise<Autor> {
    const response = await api.post('/autor/cadastrar', autor);
    return response.data;
  },

  async atualizar(id: number, autor: Partial<Autor>): Promise<Autor> {
    const response = await api.put(`/autor/alterar/${id}`, autor);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/autor/deletar/${id}`);
  }
};

// Serviços de Livros
export const livrosService = {
  async listar(): Promise<Livro[]> {
    const response = await api.get('/livros/listar');
    return response.data;
  },

  async buscarPorId(id: number): Promise<Livro> {
    const response = await api.get(`/livros/listar/${id}`);
    return response.data;
  },

  async cadastrar(livro: Omit<Livro, 'id' | 'criadoEm' | 'autor' | 'emprestado'>): Promise<Livro> {
    const response = await api.post('/livros/cadastrar', livro);
    return response.data;
  },

  async atualizar(id: number, livro: Partial<Livro>): Promise<Livro> {
    const response = await api.put(`/livros/alterar/${id}`, livro);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/livros/deletar/${id}`);
  }
};

// Serviços de Empréstimos
export const emprestimosService = {
  async listar(): Promise<Emprestimo[]> {
    const response = await api.get('/emprestimos/listar');
    return response.data;
  },

  async buscarPorId(id: number): Promise<Emprestimo> {
    const response = await api.get(`/emprestimos/listar/${id}`);
    return response.data;
  },

  async buscarPorUsuario(usuarioId: number): Promise<Emprestimo[]> {
    const response = await api.get(`/emprestimos/usuario/${usuarioId}`);
    return response.data;
  },

  async criar(livroId: number, usuarioId: number): Promise<Emprestimo> {
    const response = await api.post('/emprestimos/emprestar', { livroId, usuarioId });
    return response.data;
  },

  async devolver(id: number): Promise<Emprestimo> {
    const response = await api.put(`/emprestimos/devolucao/${id}`);
    return response.data;
  }
};
