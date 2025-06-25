'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  Book,
  Person,
  Assignment,
  PersonAdd
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { livrosService, autorService, emprestimosService, usuarioService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { Permissao } from '@/types';

interface DashboardStats {
  totalLivros: number;
  totalAutores: number;
  totalEmprestimos: number;
  totalUsuarios: number;
  livrosEmprestados: number;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalLivros: 0,
    totalAutores: 0,
    totalEmprestimos: 0,
    totalUsuarios: 0,
    livrosEmprestados: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const [livros, autores, emprestimos, usuarios] = await Promise.all([
          livrosService.listar(),
          autorService.listar(),
          emprestimosService.listar(),
          user?.permissao === Permissao.administrador ? usuarioService.listar() : Promise.resolve([])
        ]);

        const livrosEmprestados = livros.filter(livro => livro.emprestado).length;

        setStats({
          totalLivros: livros.length,
          totalAutores: autores.length,
          totalEmprestimos: emprestimos.length,
          totalUsuarios: usuarios.length,
          livrosEmprestados
        });
      } catch (err) {
        setError('Erro ao carregar estatísticas');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statsCards = [
    {
      title: 'Total de Livros',
      value: stats.totalLivros,
      icon: <Book sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1976d2'
    },
    {
      title: 'Livros Emprestados',
      value: stats.livrosEmprestados,
      icon: <Assignment sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: '#ed6c02'
    },
    {
      title: 'Total de Autores',
      value: stats.totalAutores,
      icon: <Person sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#2e7d32'
    },
    {
      title: 'Total de Empréstimos',
      value: stats.totalEmprestimos,
      icon: <Assignment sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: '#dc004e'
    }
  ];

  // Adicionar card de usuários apenas para administradores
  if (user?.permissao === Permissao.administrador) {
    statsCards.push({
      title: 'Total de Usuários',
      value: stats.totalUsuarios,
      icon: <PersonAdd sx={{ fontSize: 40, color: 'info.main' }} />,
      color: '#0288d1'
    });
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Bem-vindo(a), {user?.email}!
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
            {statsCards.map((card, index) => (
              <Card 
                key={index}
                sx={{ 
                  minWidth: 280,
                  minHeight: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderLeft: `4px solid ${card.color}`,
                  flex: '1 1 300px',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6">
                        {card.title}
                      </Typography>
                      <Typography variant="h3" component="h2">
                        {card.value}
                      </Typography>
                    </Box>
                    {card.icon}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Typography variant="h5" gutterBottom>
            Resumo do Sistema
          </Typography>
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Status da Biblioteca
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • {stats.totalLivros - stats.livrosEmprestados} livros disponíveis
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • {stats.livrosEmprestados} livros emprestados
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • {stats.totalAutores} autores cadastrados
                </Typography>
                {user?.permissao === Permissao.administrador && (
                  <Typography variant="body2" color="textSecondary">
                    • {stats.totalUsuarios} usuários registrados
                  </Typography>
                )}
              </CardContent>
            </Card>
            
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Suas Permissões
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Nível de acesso: <strong>{user?.permissao}</strong>
                </Typography>
                {user?.permissao === Permissao.administrador ? (
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Você tem acesso total ao sistema, incluindo gerenciamento de usuários.
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Você pode visualizar e gerenciar livros, autores e empréstimos.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
};

export default DashboardPage;
