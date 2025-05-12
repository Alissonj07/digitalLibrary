using System;
using BibliotecaDigital.Models;

public interface IUsuarioRepository
{
    public Usuario BuscarPorEmail(string email);
    public Usuario BuscarPorId(int id);
    public void Cadastrar(Usuario usuario);
    public List<Usuario> Listar();
    public void Deletar(Usuario usuario);
    public Usuario? BuscarUsuarioPorEmailSenha(string email, string senha);
    public void Atualizar(Usuario usuario);
    
}