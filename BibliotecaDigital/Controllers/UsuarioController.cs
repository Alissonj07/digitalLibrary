using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BibliotecaDigital.Models;
using BibliotecaDigital.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace BibliotecaDigital.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IEmprestimoRepository _emprestimoRepository;
        private readonly IConfiguration _configuration;
    public UsuarioController(IUsuarioRepository usuarioRepository, IEmprestimoRepository emprestimoRepository, IConfiguration configuration)
    {
        _usuarioRepository = usuarioRepository;
        _emprestimoRepository= emprestimoRepository;
        _configuration = configuration;
    }

    [HttpPost("cadastrar")]
    public IActionResult Cadastrar([FromBody] Usuario usuario)
    {
        try
        {
            if (usuario == null)
                return BadRequest("Dados do usuário não fornecidos.");
                
            if (string.IsNullOrEmpty(usuario.Email))
                return BadRequest("Email é obrigatório.");
                
            if (string.IsNullOrEmpty(usuario.Senha))
                return BadRequest("Senha é obrigatória.");

            var usuarioExistente = _usuarioRepository.BuscarPorEmail(usuario.Email);
            if (usuarioExistente != null)
                return BadRequest("Usuário já cadastrado.");

            _usuarioRepository.Cadastrar(usuario);
            return Created("", usuario);
        }
        catch (Exception ex)
        {
            return BadRequest($"Erro ao cadastrar usuário: {ex.Message}");
        }
    }

    [HttpGet("listar")]
    [Authorize(Roles = "administrador")]
    public IActionResult Listar()
    {        
        return Ok(_usuarioRepository.Listar());
    }

    [HttpGet("listar/{id}")]
    [Authorize(Roles = "administrador")]
    public IActionResult ListarPorId(int id)
    {
        var usuario = _usuarioRepository.BuscarPorId(id);
        if (usuario == null)
            return NotFound("Usuario não encontrado.");

        return Ok(usuario);
    }
    [HttpPost("login")]
    public IActionResult Login([FromBody] Usuario usuario)
    {
        Usuario? usuarioExistente = _usuarioRepository
            .BuscarUsuarioPorEmailSenha(usuario.Email, usuario.Senha);

        if (usuarioExistente == null)
        {
            return Unauthorized(new { mensagem = "Usuário ou senha inválidos!" });
        }

        string token = GerarToken(usuarioExistente);
        return Ok(token);
    }
    
    private string GerarToken(Usuario usuario)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, usuario.Email),
            new Claim(ClaimTypes.Role, usuario.Permissao.ToString())
        };

        var chave = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!);
        
        var assinatura = new SigningCredentials(
            new SymmetricSecurityKey(chave),
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddSeconds(3600),
            signingCredentials: assinatura
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    }
}