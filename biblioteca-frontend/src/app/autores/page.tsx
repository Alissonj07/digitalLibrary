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
  Person
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { autorService } from '@/services';
import { Autor } from '@/types';

const schema = yup.object({
  nome: yup.string().required('Nome do autor é obrigatório')
});

interface AutorFormData {
  nome: string;
}

const AutoresPage = () => {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAutor, setEditingAutor] = useState<Autor | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AutorFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: ''
    }
  });

  useEffect(() => {
    fetchAutores();
  }, []);

  const fetchAutores = async () => {
    try {
      setLoading(true);
      const data = await autorService.listar();
      setAutores(data);
    } catch (err) {
      setError('Erro ao carregar autores');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (autor?: Autor) => {
    if (autor) {
      setEditingAutor(autor);
      reset({ nome: autor.nome });
    } else {
      setEditingAutor(null);
      reset({ nome: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAutor(null);
    reset();
  };

  const onSubmit = async (data: AutorFormData) => {
    try {
      setSubmitting(true);
      
      if (editingAutor) {
        await autorService.atualizar(editingAutor.id, data);
      } else {
        await autorService.cadastrar(data);
      }
      
      await fetchAutores();
      handleCloseDialog();
    } catch (err) {
      setError('Erro ao salvar autor');
      console.error('Erro:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este autor?')) {
      try {
        await autorService.deletar(id);
        await fetchAutores();
      } catch (err) {
        setError('Erro ao excluir autor');
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
              Gerenciar Autores
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Adicionar Autor
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2}>
            {autores.map((autor) => (
              <Card key={autor.id}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Person color="primary" />
                      <Box>
                        <Typography variant="h6">
                          {autor.nome}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Criado em: {new Date(autor.criadoEm).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={() => handleOpenDialog(autor)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(autor.id)}
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

          {autores.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                Nenhum autor cadastrado
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Clique em &quot;Adicionar Autor&quot; para começar
              </Typography>
            </Box>
          )}

          {/* Dialog para adicionar/editar autor */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editingAutor ? 'Editar Autor' : 'Adicionar Novo Autor'}
            </DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <Controller
                  name="nome"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nome do Autor"
                      fullWidth
                      margin="normal"
                      error={!!errors.nome}
                      helperText={errors.nome?.message}
                    />
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

export default AutoresPage;
