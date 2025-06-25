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
  Stack
} from '@mui/material';
import {
  Add,
  Person,
  Email
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { usuarioService, authService } from '@/services';
import { Usuario, Permissao } from '@/types';

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
  permissao: yup.mixed<Permissao>().oneOf(Object.values(Permissao), 'Permissão inválida').required('Permissão é obrigatória')
});

interface UsuarioFormData {
  email: string;
  senha: string;
  permissao: Permissao;
}

const UsuariosPage = () => {
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
  } = useForm<UsuarioFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      senha: '',
      permissao: Permissao.membro
    }
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.listar();
      setUsuarios(data);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    reset({
      email: '',
      senha: '',
      permissao: Permissao.membro
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
  };

  const onSubmit = async (data: UsuarioFormData) => {
    try {
      setSubmitting(true);
      await authService.cadastrar(data);
      await fetchUsuarios();
      handleCloseDialog();
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || 'Erro desconhecido';
      setError(`Erro ao criar usuário: ${errorMessage}`);
      console.error('Erro ao cadastrar usuário:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getPermissaoColor = (permissao: Permissao) => {
    return permissao === Permissao.administrador ? 'primary' : 'default';
  };

  const getPermissaoLabel = (permissao: Permissao) => {
    return permissao === Permissao.administrador ? 'Administrador' : 'Membro';
  };

  if (loading) {
    return (
      <ProtectedRoute requiredPermission={Permissao.administrador}>
        <Layout>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPermission={Permissao.administrador}>
      <Layout>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Gerenciar Usuários
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenDialog}
            >
              Adicionar Usuário
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2}>
            {usuarios.map((usuario) => (
              <Card key={usuario.id}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Person color="primary" />
                      <Box>
                        <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                          <Email fontSize="small" />
                          {usuario.email}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Cadastrado em: {new Date(usuario.criadoEm).toLocaleDateString('pt-BR')}
                        </Typography>
                        {usuario.multa > 0 && (
                          <>
                            <br />
                            <Typography variant="caption" color="error">
                              Multa pendente: R$ {usuario.multa.toFixed(2)}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={getPermissaoLabel(usuario.permissao)}
                        color={getPermissaoColor(usuario.permissao)}
                        size="small"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {usuarios.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                Nenhum usuário cadastrado
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Clique em &quot;Adicionar Usuário&quot; para começar
              </Typography>
            </Box>
          )}

          {/* Dialog para adicionar usuário */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      fullWidth
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  name="senha"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Senha"
                      type="password"
                      fullWidth
                      margin="normal"
                      error={!!errors.senha}
                      helperText={errors.senha?.message}
                    />
                  )}
                />

                <Controller
                  name="permissao"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal" error={!!errors.permissao}>
                      <InputLabel>Permissão</InputLabel>
                      <Select
                        {...field}
                        label="Permissão"
                      >
                        <MenuItem value={Permissao.membro}>Membro</MenuItem>
                        <MenuItem value={Permissao.administrador}>Administrador</MenuItem>
                      </Select>
                      {errors.permissao && (
                        <Typography variant="caption" color="error">
                          {errors.permissao.message}
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
                {submitting ? <CircularProgress size={20} /> : 'Criar Usuário'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Layout>
    </ProtectedRoute>
  );
};

export default UsuariosPage;
