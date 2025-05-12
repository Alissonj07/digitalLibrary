using BibliotecaDigital.Models;

namespace BibliotecaDigital.Data;

public class AutorRepository : IAutorRepository
{
    private readonly AppDataContext _context;

    public AutorRepository(AppDataContext context)
    {
        _context = context;
    }

    public void Cadastrar(Autor autor)
    {
        _context.Autores.Add(autor);
        _context.SaveChanges();
    }

    public List<Autor> Listar()
    {
        return _context.Autores.ToList();
    }

    public Autor BuscarPorId(int id)
    {
        return _context.Autores.FirstOrDefault(a => a.Id == id);
    }

    public Autor BuscarPorNome(string nome)
    {
        return _context.Autores.FirstOrDefault(a => a.Nome == nome);
    }

    public void Deletar(Autor autor)
    {
        _context.Autores.Remove(autor);
        _context.SaveChanges();
    }
}