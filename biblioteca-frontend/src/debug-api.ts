// Debug: Teste de conectividade com a API
console.log('🔍 Testando conectividade com a API...');
console.log('URL da API:', process.env.NEXT_PUBLIC_API_URL);

// Teste básico de fetch
fetch('http://localhost:5027/api/usuario/listar', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(response => {
  console.log('✅ Resposta da API:', response.status);
  return response.json();
})
.then(data => {
  console.log('📦 Dados recebidos:', data);
})
.catch(error => {
  console.error('❌ Erro de conectividade:', error);
});

export {};
