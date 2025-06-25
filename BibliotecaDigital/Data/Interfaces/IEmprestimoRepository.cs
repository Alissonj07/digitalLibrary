using System;
using BibliotecaDigital.Models;

public interface IEmprestimoRepository
{
    public void Cadastrar(Emprestimo emprestimo);
    public List<Emprestimo> Listar();
    public List<Emprestimo> ListarPorUsuario(int usuarioId);
    public Emprestimo? BuscarPorId(int id);
    public Emprestimo? BuscarPorLivroId(int livroId);
    public void Finalizar(Emprestimo emprestimo);
    public void Atualizar(Emprestimo emprestimo);
}