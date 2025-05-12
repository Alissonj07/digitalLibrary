using Microsoft.EntityFrameworkCore;
using BibliotecaDigital.Models;

namespace BibliotecaDigital.Data;

public class AppDataContext : DbContext
{
    public AppDataContext(DbContextOptions<AppDataContext> options) : base(options) { }

    public DbSet<Autor> Autores { get; set; }
    public DbSet<Livros> Livros { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Emprestimo> Emprestimos { get; set; }
}