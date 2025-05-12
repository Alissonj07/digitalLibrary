using BibliotecaDigital.Models;

namespace BibliotecaDigital.Data;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDataContext _context;

    public UsuarioRepository(AppDataContext context)
    {
        _context = context;
    }

    public Usuario BuscarPorEmail(string email)
    {
        return _context.Usuarios.FirstOrDefault(u => u.Email == email);
    }

    public Usuario BuscarPorId(int id)
    {
        return _context.Usuarios.FirstOrDefault(u => u.Id == id);
    }

    public void Cadastrar(Usuario usuario)
    {
        _context.Usuarios.Add(usuario);
        _context.SaveChanges();
    }

    public List<Usuario> Listar()
    {
        return _context.Usuarios.ToList();
    }

    public void Deletar(Usuario usuario)
    {
        _context.Usuarios.Remove(usuario);
        _context.SaveChanges();
    }
    public Usuario? BuscarUsuarioPorEmailSenha(string email, string senha)
    {
        Usuario? usuarioExistente = 
            _context.Usuarios.FirstOrDefault
            (x => x.Email == email && x.Senha == senha);
        return usuarioExistente;
    }
public void Atualizar(Usuario usuario)
{
    _context.Usuarios.Update(usuario);
    _context.SaveChanges();
}
}