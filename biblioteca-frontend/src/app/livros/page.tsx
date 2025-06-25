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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Stack,
  IconButton
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Book,
  Person
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { livrosService, autorService } from '@/services';
import { Livro, Autor } from '@/types';

const schema = yup.object({
  nome: yup.string().required('Nome do livro é obrigatório'),
  autorId: yup.number().required('Autor é obrigatório').min(1, 'Selecione um autor')
});

interface LivroFormData {
  nome: string;
  autorId: number;
}

const LivrosPage = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLivro, setEditingLivro] = useState<Livro | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LivroFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: '',
      autorId: 0
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [livrosData, autoresData] = await Promise.all([
        livrosService.listar(),
        autorService.listar()
      ]);
      setLivros(livrosData);
      setAutores(autoresData);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (livro?: Livro) => {
    if (livro) {
      setEditingLivro(livro);
      reset({
        nome: livro.nome,
        autorId: livro.autorId
      });
    } else {
      setEditingLivro(null);
      reset({
        nome: '',
        autorId: 0
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLivro(null);
    reset();
  };

  const onSubmit = async (data: LivroFormData) => {
    try {
      setSubmitting(true);
      
      if (editingLivro) {
        await livrosService.atualizar(editingLivro.id, data);
      } else {
        await livrosService.cadastrar(data);
      }
      
      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao salvar livro');
      console.error('Erro:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      try {
        await livrosService.deletar(id);
        await fetchData();
      } catch (err) {
        setError('Erro ao excluir livro');
        console.error('Erro:', err);
      }
    }
  };

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
              Gerenciar Livros
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Adicionar Livro
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2}>
            {livros.map((livro) => (
              <Card key={livro.id}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Book color="primary" />
                      <Box>
                        <Typography variant="h6">
                          {livro.nome}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Person fontSize="small" color="action" />
                          <Typography variant="body2" color="textSecondary">
                            {livro.autor?.nome || 'Autor não informado'}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          Criado em: {new Date(livro.criadoEm).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={livro.emprestado ? 'Emprestado' : 'Disponível'}
                        color={livro.emprestado ? 'warning' : 'success'}
                        size="small"
                      />
                      <IconButton
                        onClick={() => handleOpenDialog(livro)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(livro.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {livros.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                Nenhum livro cadastrado
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Clique em &quot;Adicionar Livro&quot; para começar
              </Typography>
            </Box>
          )}

          {/* Dialog para adicionar/editar livro */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editingLivro ? 'Editar Livro' : 'Adicionar Novo Livro'}
            </DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <Controller
                  name="nome"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nome do Livro"
                      fullWidth
                      margin="normal"
                      error={!!errors.nome}
                      helperText={errors.nome?.message}
                    />
                  )}
                />

                <Controller
                  name="autorId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal" error={!!errors.autorId}>
                      <InputLabel>Autor</InputLabel>
                      <Select
                        {...field}
                        label="Autor"
                      >
                        <MenuItem value={0}>Selecione um autor</MenuItem>
                        {autores.map((autor) => (
                          <MenuItem key={autor.id} value={autor.id}>
                            {autor.nome}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.autorId && (
                        <Typography variant="caption" color="error">
                          {errors.autorId.message}
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
                {submitting ? <CircularProgress size={20} /> : 'Salvar'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
};

export default LivrosPage;
