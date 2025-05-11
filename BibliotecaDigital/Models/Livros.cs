using System;

namespace BibliotecaDigital.Models;

public class Livros
{
    public int Id { get; set; }
    public required string Nome { get; set; }
    public int AutorId { get; set; }
    public required Autor autor { get; set; }
    public Boolean emprestado { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;
}
