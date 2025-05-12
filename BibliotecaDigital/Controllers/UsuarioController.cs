using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BibliotecaDigital.Models;
using BibliotecaDigital.Data;

namespace BibliotecaDigital.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IEmprestimoRepository _emprestimoRepository;
    public AutorController(IUsuarioRepository usuarioRepository, IEmprestimoRepository emprestimoRepository,)
    {
        _usuarioRepository = usuarioRepository;
        _emprestimoRepository= usuarioRepository;
    }

    [HttpPost("cadastrar")]
    [Authorize]
    public IActionResult Cadastrar([FromBody] Usuario usuario)
    {
        var usuarioExistente = _usuarioRepository.BuscarPorEmail(usuario.Email);
        if (usuarioExistente != null)
            return BadRequest("Usuário já cadastrado.");

        _usuarioRepository.Cadastrar(usuario);
        return Created("", usuario);
    }

    [HttpGet("listar")]
    [Authorize]
    public IActionResult Listar()
    {        
        return Ok(_usuarioRepository.Listar());
    }

    [HttpGet("listar/{id}")]
    [Authorize]
    public IActionResult ListarPorId(int id)
    {
        var usuario = _usuarioRepository.BuscarPorId(id);
        if (usuario == null)
            return NotFound("Usuario não encontrado.");

        return Ok(usuario);
    }
    }
}