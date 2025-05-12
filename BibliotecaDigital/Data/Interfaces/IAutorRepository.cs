using System;
using BibliotecaDigital.Models;

public interface IAutorRepository
{
    void Cadastrar(Autor autor);
    public List<Autor> Listar();
    public Autor BuscarPorId(int id);
    public Autor BuscarPorNome(string nome);
    public void Deletar(Autor autor);
}