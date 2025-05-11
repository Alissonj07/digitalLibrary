using System;

namespace BibliotecaDigital.Models;

public class Emprestimo
{
    public int Id { get; set; }
    public int livroId { get; set; }
    public required Livros livro { get; set; }
    public int usuarioId { get; set; }
    public required Usuario usuario { get; set; }
    public float multa { get; set; }
    public DateTime dataDeExpiração { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;
}
