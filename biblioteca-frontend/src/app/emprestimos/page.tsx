'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  Add,
  Assignment,
  Book,
  Person,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { emprestimosService, livrosService, usuarioService } from '@/services';
import { Emprestimo, Livro, Usuario, Permissao } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const schema = yup.object({
  livroId: yup.number().required('Livro é obrigatório').min(1, 'Selecione um livro'),
  usuarioId: yup.number().required('Usuário é obrigatório').min(1, 'Selecione um usuário')
});

interface EmprestimoFormData {
  livroId: number;
  usuarioId: number;
}

const EmprestimosPage = () => {
  const { user } = useAuth();
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EmprestimoFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      livroId: 0,
      usuarioId: 0
    }
  });

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [emprestimosData, livrosData, usuariosData] = await Promise.all([
        emprestimosService.listar(),
        livrosService.listar(),
        user?.permissao === Permissao.administrador ? usuarioService.listar() : Promise.resolve([])
      ]);
      
      setEmprestimos(emprestimosData);
      setLivros(livrosData);
      setUsuarios(usuariosData);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.permissao]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDialog = () => {
    reset({
      livroId: 0,
      usuarioId: 0
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
  };

  const onSubmit = async (data: EmprestimoFormData) => {
    try {
      setSubmitting(true);
      await emprestimosService.criar(data.livroId, data.usuarioId);
      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao criar empréstimo');
      console.error('Erro:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDevolver = async (id: number) => {
    if (window.confirm('Confirmar devolução do livro?')) {
      try {
        await emprestimosService.devolver(id);
        await fetchData();
      } catch (err) {
        setError('Erro ao devolver livro');
        console.error('Erro:', err);
      }
    }
  };

  const isEmprestimoAtrasado = (dataExpiracao: string): boolean => {
    return new Date(dataExpiracao) < new Date();
  };

  const livrosDisponiveis = livros.filter(livro => !livro.emprestado);

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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Gerenciar Empréstimos
            </Typography>
            {user?.permissao === Permissao.administrador && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenDialog}
              >
                Novo Empréstimo
              </Button>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2}>
            {emprestimos.map((emprestimo) => (
              <Card key={emprestimo.id}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Assignment color="primary" />
                      <Box>
                        <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                          <Book fontSize="small" />
                          {emprestimo.livro.nome}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" display="flex" alignItems="center" gap={1}>
                          <Person fontSize="small" />
                          {emprestimo.usuario.email}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Emprestado em: {new Date(emprestimo.criadoEm).toLocaleDateString('pt-BR')}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="textSecondary">
                          Vence em: {new Date(emprestimo.dataDeExpircao).toLocaleDateString('pt-BR')}
                        </Typography>
                        {emprestimo.multa > 0 && (
                          <>
                            <br />
                            <Typography variant="caption" color="error">
                              Multa: R$ {emprestimo.multa.toFixed(2)}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      {emprestimo.concluidoEm ? (
                        <Chip
                          label="Devolvido"
                          color="success"
                          size="small"
                          icon={<CheckCircle />}
                        />
                      ) : isEmprestimoAtrasado(emprestimo.dataDeExpircao) ? (
                        <Chip
                          label="Atrasado"
                          color="error"
                          size="small"
                          icon={<Schedule />}
                        />
                      ) : (
                        <Chip
                          label="Em andamento"
                          color="warning"
                          size="small"
                          icon={<Schedule />}
                        />
                      )}
                      
                      {!emprestimo.concluidoEm && user?.permissao === Permissao.administrador && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDevolver(emprestimo.id)}
                          startIcon={<CheckCircle />}
                        >
                          Devolver
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {emprestimos.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                Nenhum empréstimo registrado
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.permissao === Permissao.administrador
                  ? 'Clique em "Novo Empréstimo" para começar'
                  : 'Nenhum empréstimo encontrado'
                }
              </Typography>
            </Box>
          )}

          {/* Dialog para novo empréstimo */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Novo Empréstimo</DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <Controller
                  name="livroId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal" error={!!errors.livroId}>
                      <InputLabel>Livro</InputLabel>
                      <Select
                        {...field}
                        label="Livro"
                      >
                        <MenuItem value={0}>Selecione um livro</MenuItem>
                        {livrosDisponiveis.map((livro) => (
                          <MenuItem key={livro.id} value={livro.id}>
                            {livro.nome} - {livro.autor?.nome || 'Autor não informado'}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.livroId && (
                        <Typography variant="caption" color="error">
                          {errors.livroId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />

                <Controller
                  name="usuarioId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal" error={!!errors.usuarioId}>
                      <InputLabel>Usuário</InputLabel>
                      <Select
                        {...field}
                        label="Usuário"
                      >
                        <MenuItem value={0}>Selecione um usuário</MenuItem>
                        {usuarios.map((usuario) => (
                          <MenuItem key={usuario.id} value={usuario.id}>
                            {usuario.email}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.usuarioId && (
                        <Typography variant="caption" color="error">
                          {errors.usuarioId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={20} /> : 'Criar Empréstimo'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
};

export default EmprestimosPage;
