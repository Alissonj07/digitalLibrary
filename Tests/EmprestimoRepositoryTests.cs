/*using BibliotecaDigital.Data;
using BibliotecaDigital.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class EmprestimoRepositoryTests
{
    [Fact]
    public void DeveCriarEmprestimo()
    {
        var options = new DbContextOptionsBuilder<AppDataContext>()
            .UseInMemoryDatabase(databaseName: "TesteEmprestimo")
            .Options;

        using (var context = new AppDataContext(options))
        {
            var repository = new EmprestimoRepository(context);

            var livro = new Livros { Id = 1, Titulo = "Livro Teste", Emprestado = false };
            var usuario = new Usuario { Id = 1, Nome = "Usuário Teste" };

            var emprestimo = new Emprestimo(livro, usuario)
            {
                dataDeExpircao = DateTime.Now.AddDays(7)
            };

            repository.Cadastrar(emprestimo);

            Assert.Single(context.Emprestimos);
        }
    }
}