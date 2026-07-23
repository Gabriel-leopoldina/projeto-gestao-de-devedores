import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CssBaseline
} from '@mui/material'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem!')
      return
    }

    setLoading(true)

    try {
      await api.post('/register', { username, email, password })
      
      setSuccessMessage('Usuário cadastrado com sucesso!')
      
      setUsername('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (err) {
      if (err.response?.data?.error) {
        setErrorMessage(err.response.data.error)
      } else {
        setErrorMessage('Erro ao cadastrar usuário. Verifique se o nome já existe.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        boxSizing: 'border-box'
      }}
    >
      <CssBaseline />

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '24px',
          p: { xs: 3, sm: 5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} color="primary">
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Typography component="h1" variant="h5" align="center" fontWeight="bold" gutterBottom>
          Novo Usuário
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Cadastre um operador para o sistema
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2, width: '100%', borderRadius: '12px' }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, width: '100%', borderRadius: '12px' }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>

          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nome de Usuário"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px' }
            }}
          />

          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="E-mail (Opcional)"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px' }
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: '12px' }
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar Senha"
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px' }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 1,
              py: 1.5,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}