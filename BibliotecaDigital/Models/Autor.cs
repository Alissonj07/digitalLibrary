using System;

namespace BibliotecaDigital.Models;

public class Autor
{
    public int Id { get; set; }
    public required string Nome { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;
}
