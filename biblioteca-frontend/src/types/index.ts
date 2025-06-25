// Tipos baseados nos modelos do backend

export enum Permissao {
  membro = 'membro',
  administrador = 'administrador'
}

export interface Usuario {
  id: number;
  email: string;
  senha?: string;
  permissao: Permissao;
  criadoEm: string;
  multa: number;
}

export interface Autor {
  id: number;
  nome: string;
  criadoEm: string;
}

export interface Livro {
  id: number;
  nome: string;
  autorId: number;
  autor: Autor | null;
  emprestado: boolean;
  criadoEm: string;
}

export interface Emprestimo {
  id: number;
  livroId: number;
  livro: Livro;
  usuarioId: number;
  usuario: Usuario;
  multa: number;
  dataDeExpircao: string;
  criadoEm: string;
  concluidoEm?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
