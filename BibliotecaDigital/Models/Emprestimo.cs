using System;

namespace BibliotecaDigital.Models;

public class Emprestimo
{
    // Construtor sem parâmetros exigido pelo EF Core
    public Emprestimo() { }

    public Emprestimo(Livros livro, Usuario usuario)
    {
        this.livro = livro;
        this.usuario = usuario;
        usuarioId = usuario.Id;
        livroId = livro.Id;
    }

    public int Id { get; set; }
    public int livroId { get; set; }
    public Livros livro { get; set; } = null!;
    public int usuarioId { get; set; }
    public Usuario usuario { get; set; } = null!;
    public float Multa { get; set; }
    public DateTime dataDeExpircao { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;
    public DateTime? ConcluidoEm { get; set; }
}
