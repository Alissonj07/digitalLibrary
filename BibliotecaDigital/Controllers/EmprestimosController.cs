using BibliotecaDigital.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BibliotecaDigital.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmprestimosController : ControllerBase
    {
        private readonly IEmprestimoRepository _emprestimoRepository;
        private readonly IAutorRepository _autorRepository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ILivrosRepository _livrosRepository;

    public EmprestimosController(ILivrosRepository livrosRepository, IEmprestimoRepository emprestimoRepository, IAutorRepository autorRepository, IUsuarioRepository usuarioRepository)
    {
        _emprestimoRepository = emprestimoRepository;
        _autorRepository = autorRepository;
        _usuarioRepository = usuarioRepository;
     }

    [HttpPost("cadastrar/{livroId}")]
    [Authorize]
    public IActionResult Cadastrar(int livroId)
    {
        var email = User.Identity?.Name; 
        var usuarioExistente = _usuarioRepository.BuscarPorEmail(email);
        if (usuarioExistente == null)
            return NotFound("Usuário não encontrado.");
        if (usuarioExistente.Multa > 0)
            return BadRequest("Usuário com multa pendente.");

        var livroExistente = _livrosRepository.BuscarPorId(livroId);
        if (livroExistente == null)
            return NotFound("Livro não encontrado.");

        if (livroExistente.emprestado == true)
            return BadRequest("Livro já emprestado.");

        var emprestimo = new Emprestimo(livroExistente, usuarioExistente)
        {
            livro = livroExistente, 
            usuario = usuarioExistente, 
            dataDeExpircao = DateTime.Now.AddDays(7) 
        };

        livroExistente.emprestado = true;
        _livrosRepository.Atualizar(livroExistente);
        _emprestimoRepository.Cadastrar(emprestimo);
        return Created("", emprestimo);
    }

    [HttpGet("listar")]
    [Authorize(Roles = "admin")]
    public IActionResult Listar()
    {        
        return Ok(_emprestimoRepository.Listar());
    }
     

    [HttpPut("devolucao/{id}")]
    [Authorize]
    public IActionResult Devolucao(int id)
    {   string mesage = "";

        var emprestimo = _emprestimoRepository.BuscarPorId(id);
        if (emprestimo == null)
            return NotFound("Empréstimo não encontrado.");

        var usuario = _usuarioRepository.BuscarPorId(emprestimo.usuarioId);
        if (usuario == null)
            return NotFound("Usuário não encontrado.");
        

        if (emprestimo.dataDeExpircao < DateTime.Now)
        {
            emprestimo.Multa = (float)(DateTime.Now - emprestimo.dataDeExpircao).TotalDays * 5.00f;
            usuario.Multa += emprestimo.Multa;
            _usuarioRepository.Atualizar(usuario);
            mesage = string.Format("Devolução atrasada. Multa de {0:C} aplicada.", emprestimo.Multa);
        }

         emprestimo.ConcluidoEm = DateTime.Now;
        _emprestimoRepository.Atualizar(emprestimo);

        var livro = _livrosRepository.BuscarPorId(emprestimo.livroId);
        livro.emprestado = false;
        _livrosRepository.Atualizar(livro);

        return Ok("Devolução registrada com sucesso." + mesage);
    }

    //[HttpPost("teste")]
   // public IActionResult TestarEmprestimo()
   // {
        //var livro = new Livros { Id = 1, Titulo = "Livro Teste", Emprestado = false };
       // var usuario = new Usuario { Id = 1, Nome = "Usuário Teste" };

       // var emprestimo = new Emprestimo(livro, usuario)
       // {
      //      dataDeExpircao = DateTime.Now.AddDays(7)
      //  };

       // _emprestimoRepository.Cadastrar(emprestimo);

      //  return Ok("Emprestimo criado com sucesso!");
   // }
        
    }
}