using System;
using BibliotecaDigital.Models;

public interface ILivrosRepository
{
    public void Cadastrar(Livros livro);
    public List<Livros> Listar();
    public Livros BuscarPorId(int id);
    public void Deletar(Livros livro);
    public List<Livros> ListarDisponiveis();
    public List<Livros> ListarPorAutor(int autorId);
    public void Atualizar(Livros livro);
}