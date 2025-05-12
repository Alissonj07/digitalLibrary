using BibliotecaDigital.Models;

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
        return _context.Livros.ToList();
    }

    public List<Livros> ListarPorAutor(int autorId)
    {
        return _context.Livros.Where(l => l.AutorId == autorId).ToList();
    }

    public Livros BuscarPorId(int id)
    {
        return _context.Livros.FirstOrDefault(l => l.Id == id);
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
        return _context.Livros.Where(l => !l.emprestado).ToList();
    }

    public void Atualizar(Livros livro)
    {
        _context.Livros.Update(livro);
        _context.SaveChanges();
    }
}