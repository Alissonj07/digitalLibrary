using Microsoft.AspNetCore.Mvc;
using BibliotecaDigital.Services;
using BibliotecaDigital.Models;

namespace BibliotecaDigital.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmprestimosController : ControllerBase
    {
        private readonly IEmprestimoRepository _emprestimoRepository;
        private readonly IAutorRepository _autorRepository;
        private readonly IUsuarioRepositoy _usuarioRepository;

    public EmprestimosController(IEmprestimoRepository emprestimoRepository, IAutorRepository autorRepository, IUsuarioRepositoy usuarioRepository)
    {
        _emprestimoRepository = emprestimoRepository;
        _autorRepository = autorRepository;
        _usuarioRepository = usuarioRepository;
     }

    [HttpPost("cadastrar/{livroId}")]
    [Authorize]
    public IActionResult Cadastrar(int livroId)
    {
        var usuarioExistente = _usuarioRepository.BuscarPorEmail(Email);
        if (usuarioExistente == null)
            return NotFound("Usuário não encontrado.");
        if (usuarioExistente.Multa > 0)
            return BadRequest("Usuário com multa pendente.");

        var livroExistente = _livrosRepository.BuscarPorId(livroId);
        if (livroExistente == null)
            return NotFound("Livro não encontrado.");

        if (livroExistente.emprestado == true)
            return BadRequest("Livro já emprestado.");

        var emprestimo = new Emprestimo
        {
            Usuario = usuario,
            Livro = livro,
            DataEmprestimo = DateTime.Now,
            DataDevolucao = DateTime.Now.AddDays(7) 
        };

        livroExistente.emprestado = true;
        _livrosRepository.Atualizar(livroExistente);
        _emprestimoRepository.Cadastrar(emprestimo);
        return Created("", emprestimo);
    }

    [HttpGet("listar")]
    [Authorize]
    public IActionResult Listar()
    {        
        return Ok(_emprestimoRepository.Listar());
    }
     

    [HttpUptade("devolucao/{id}")]
    [Authorize]
    public IActionResult Devolucao(int id)
    {   string mesage = "";

        var emprestimo = _emprestimoRepository.BuscarPorId(id);
        if (emprestimo == null)
            return NotFound("Empréstimo não encontrado.");

        var usuario = _usuarioRepository.BuscarPorId(emprestimo.usuarioId);
        if (usuario == null)
            return NotFound("Usuário não encontrado.");
        

        if (emprestimo.dataDeExpiracao < DateTime.Now)
        {
            emprestimo.Multa = (float)(DateTime.Now - emprestimo.dataDeExpiracao).TotalDays * 5.00f;
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
        
    }
}