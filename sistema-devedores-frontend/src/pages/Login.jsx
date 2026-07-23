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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      const response = await api.post('/login', { username, password })
      const token = response.data.token

      localStorage.setItem('token', token)
      navigate('/') 

    } catch (err) {
      setErrorMessage('Usuário e/ou Senha Incorretos.')
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
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <CssBaseline />

      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          gap: 2,
        }}
      >
        
        <Box
          sx={{
            flex: 1,
            backgroundImage: 'url(/imagemfundo.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            borderRadius: '24px',
            display: { xs: 'none', md: 'block' },
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)'
          }}
        />

        <Paper
          elevation={0}
          sx={{
            width: { xs: '100%', md: '420px' },
            height: '100%',
            borderRadius: '24px',
            p: { xs: 3, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '360px'
            }}
          >
            <Typography component="h1" variant="h5" align="center" fontWeight="bold" gutterBottom>
              Gerenciamento de Devedores
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2, width: '100%', borderRadius: '12px' }}>
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="usuário"
                label="Usuário"
                name="usuário"
                autoComplete="usuário"
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
                required
                fullWidth
                name="password"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
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
                        aria-label="toggle password visibility"
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  mb: 2,
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
                {loading ? 'Aguarde...' : 'Entrar'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}