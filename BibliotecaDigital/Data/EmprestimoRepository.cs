using BibliotecaDigital.Models;
using Microsoft.EntityFrameworkCore;

namespace BibliotecaDigital.Data;

public class EmprestimoRepository : IEmprestimoRepository
{
    private readonly AppDataContext _context;

    public EmprestimoRepository(AppDataContext context)
    {
        _context = context;
    }

    public void Cadastrar(Emprestimo emprestimo)
    {
        _context.Emprestimos.Add(emprestimo);
        _context.SaveChanges();
    }

    public List<Emprestimo> Listar()
    {
        return _context.Emprestimos
            .Include(e => e.livro)
                .ThenInclude(l => l.Autor)
            .Include(e => e.usuario)
            .ToList();
    }

    public List<Emprestimo> ListarPorUsuario(int usuarioId)
    {
        return _context.Emprestimos
            .Include(e => e.livro)
                .ThenInclude(l => l.Autor)
            .Include(e => e.usuario)
            .Where(e => e.usuarioId == usuarioId)
            .ToList();
    }

    public Emprestimo? BuscarPorId(int id)
    {
        return _context.Emprestimos
            .Include(e => e.livro)
                .ThenInclude(l => l.Autor)
            .Include(e => e.usuario)
            .FirstOrDefault(e => e.Id == id);
    }

    public Emprestimo? BuscarPorLivroId(int livroId)
    {
        return _context.Emprestimos
            .Include(e => e.livro)
                .ThenInclude(l => l.Autor)
            .Include(e => e.usuario)
            .FirstOrDefault(e => e.livroId == livroId && e.ConcluidoEm == null);
    }

    public void Finalizar(Emprestimo emprestimo)
    {
        emprestimo.dataDeExpircao = DateTime.Now;
        _context.Emprestimos.Update(emprestimo);
        _context.SaveChanges();
    }
    public void Atualizar(Emprestimo emprestimo)
{
    _context.Emprestimos.Update(emprestimo);
    _context.SaveChanges();
}
}