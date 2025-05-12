using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BibliotecaDigital.Models;
using BibliotecaDigital.Data;

namespace BibliotecaDigital.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class LivrosController : ControllerBase
    {
    
        private readonly ILivrosRepository _livrosRepository;
        private readonly IAutorRepository _autorRepository;
        private readonly IEmprestimoRepository _emprestimoRepository;

        public LivrosController(ILivrosRepository livrosRepository, IAutorRepository autorRepository, IEmprestimoRepository emprestimoRepository)
        {
            _autorRepository = autorRepository;
            _emprestimoRepository = emprestimoRepository;
            _livrosRepository = livrosRepository;
        }

        
        [HttpGet("listar")]
        public IActionResult listar()
        {
             return Ok(_livrosRepository.Listar());
        }

        [HttpGet("listar/{id}")]
        public IActionResult ListarPorId(int id)
        {
            var livro = _livrosRepository.BuscarPorId(id);
            if (livro == null)
                return NotFound("Livro não encontrado.");

            return Ok(livro);
        }
        
        [HttpPost("cadastrar")]
        [Authorize(Roles = "admin")]
        public IActionResult Cadastrar([FromBody] Livros livro, int AutorId)
        {
            var autorExistente = _autorRepository.BuscarPorId(AutorId);
            if (autorExistente == null)
                return NotFound("Autor não encontrado.");

            livro.autor = autorExistente;
        

            _livrosRepository.Cadastrar(livro);
            return Created("",livro);

        }

        
        [HttpDelete("deletar/{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult Deletar(int id)
        {
            var livro = _livrosRepository.BuscarPorId(id);
            if (livro == null)
                return NotFound("Livro não encontrado.");

            var emprestimo = _emprestimoRepository.BuscarPorLivroId(id);
            if (emprestimo != null)
                return BadRequest("Não é possível excluir o livro, pois ele está associado a um empréstimo.");

            _livrosRepository.Deletar(livro);
            return Ok("Livro excluído com sucesso.");
        }
         [HttpGet("listarDisponiveis")]
        public IActionResult listarDisponiveis()
        {
             return Ok(_livrosRepository.Listar());
        }
    }
}
