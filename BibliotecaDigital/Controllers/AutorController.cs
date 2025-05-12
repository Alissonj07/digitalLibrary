using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BibliotecaDigital.Models;
using BibliotecaDigital.Data;

namespace BibliotecaDigital.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AutorController : ControllerBase
    {
        private readonly IAutorRepository _autorRepository;
        private readonly ILivrosRepository _livrosRepository;
    public AutorController(IAutorRepository autorRepository, ILivrosRepository livrosRepository,)
    {
        _autorRepository = autorRepository;
        _livrosRepository = livrosRepository;
    }

    [HttpPost("cadastrar")]
    [Authorize]
    public IActionResult Cadastrar([FromBody] Autor autor)
    {
         var AutorExistente = _autorRepository.BuscarPorNome(autor.Nome);
        if (AutorExistente != null)
            return BadRequest("Usuário já cadastrado.");
         _autorRepository.Cadastrar(autor);
        return Created("", autor);

    }

    [HttpGet("listar")]
    public IActionResult Listar()
    {        
        return Ok(_autorRepository.Listar());
    }

    [HttpGet("listar/{id}")]
    public IActionResult ListarPorId(int id)
    {
        var autor = _autorRepository.BuscarPorId(id);
        if (autor == null)
            return NotFound("Autor não encontrado.");

        return Ok(autor);
    }

    [HttpDelete("deletar/{id}")]
    [Authorize]
    public IActionResult Deletar(int id)
    {
        var autor = _autorRepository.BuscarPorId(id);
        if (autor == null)
            return NotFound("Autor não encontrado.");

        var livros = _livrosRepository.ListarPorAutor(id);
        if (livros.Any())
            return BadRequest("Não é possível excluir o autor, pois ele está associado a livros.");

        _autorRepository.Deletar(autor);
        return Ok("Autor excluído com sucesso.");
    }
    }
}