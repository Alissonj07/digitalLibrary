using BibliotecaDigital.Models;
using Microsoft.EntityFrameworkCore;

namespace BibliotecaDigital.Data;

public class LivrosRepository : ILivrosRepository
{
    private readonly AppDataContext _context;

    public LivrosRepository(AppDataContext context)
    {
        _context = context;
    }

    public List<Livros> Listar()
    {
        return _context.Livros
            .Include(l => l.Autor)
            .ToList();
    }

    public List<Livros> ListarPorAutor(int autorId)
    {
        return _context.Livros
            .Include(l => l.Autor)
            .Where(l => l.AutorId == autorId)
            .ToList();
    }

    public Livros? BuscarPorId(int id)
    {
        return _context.Livros
            .Include(l => l.Autor)
            .FirstOrDefault(l => l.Id == id);
    }

    public void Cadastrar(Livros livro)
    {
        _context.Livros.Add(livro);
        _context.SaveChanges();
    }

    public void Deletar(Livros livro)
    {
        _context.Livros.Remove(livro);
        _context.SaveChanges();
    }

    public List<Livros> ListarDisponiveis()
    {
        return _context.Livros.Where(l => !l.Emprestado).ToList();
    }

    public void Atualizar(Livros livro)
    {
        _context.Livros.Update(livro);
        _context.SaveChanges();
    }
}