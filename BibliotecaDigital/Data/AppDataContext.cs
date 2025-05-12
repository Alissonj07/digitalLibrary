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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Emprestimo>(entity =>
        {
            entity.HasKey(e => e.Id);

        
            entity.HasOne(e => e.livro)
                  .WithMany()
                  .HasForeignKey(e => e.livroId);

            entity.HasOne(e => e.usuario)
                  .WithMany()
                  .HasForeignKey(e => e.usuarioId);

            entity.Property(e => e.dataDeExpircao).IsRequired();
        });
    }
}