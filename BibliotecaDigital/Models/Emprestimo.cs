using System;

namespace BibliotecaDigital.Models;

public class Emprestimo
{
    public Emprestimo(Livros livro,  Usuario usuario){
        usuarioId = usuario.Id;
        livroId = livro.Id;
    }
    public int Id { get; set; }
    public int livroId { get; set; }
    public required Livros livro { get; set; }
    public int usuarioId { get; set; }
    public required Usuario usuario { get; set; }
    public float multa { get; set; }
    public DateTime dataDeExpiração { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;
}
