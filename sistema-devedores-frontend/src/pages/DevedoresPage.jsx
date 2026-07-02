import { useEffect, useState } from 'react'

import {
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'

import { api } from '../services/api.js'
import DevedoresTable from '../components/DevedoresTable.jsx'
import NovoDevedorDialog from '../components/NovoDevedorDialog.jsx'



export default function DevedoresPage() {
  const [devedores, setDevedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [pesquisa, setPesquisa] = useState('')
  const [openNovoDevedor, setOpenNovoDevedor] = useState(false)
  const [erro, setErro] = useState('')
  const [snackbar, setSnackbar] = useState(false)
  const [mensagemSnackbar, setMensagemSnackbar] = useState('')
  const [openExcluir, setOpenExcluir] = useState(false)
  const [devedorExcluir, setDevedorExcluir] = useState(null)
  const [devedorEditando, setDevedorEditando] = useState(null)

  async function carregarDevedores() {
    setLoading(true)

    try {
      const { data } = await api.get('/devedores')
      setDevedores(data)
    } catch (e) {
      setErro('Erro ao carregar devedores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDevedores()
  }, [])

const devedoresFiltrados = devedores.filter((devedor) => {
  const texto = pesquisa.toLowerCase()

  return (
    devedor.nome?.toLowerCase().includes(texto) ||
    devedor.cpf?.includes(texto) ||
    devedor.cnpj?.includes(texto) ||
    devedor.telefone?.includes(texto)
  )
})

  function abrirModalNovo() {
    setErro('')
    setDevedorEditando(null)
    setOpenNovoDevedor(true)
  }
  
  function abrirDialogExcluir(devedor) {
  setDevedorExcluir(devedor)
  setOpenExcluir(true)
}

  function abrirModalEditar(devedor) {
    setErro('')
    setDevedorEditando(devedor)
    setOpenNovoDevedor(true)
  }

  function fecharModal() {
    setOpenNovoDevedor(false)
    setErro('')
    setDevedorEditando(null)
  }

  async function salvarDevedor(payload) {
    try {
      if (devedorEditando) {
        await api.put(`/devedores/${devedorEditando.id}`, payload)
        setMensagemSnackbar('Devedor atualizado com sucesso!')
      } else {
        await api.post('/devedores', payload)
        setMensagemSnackbar('Devedor salvo com sucesso!')
      }

      setSnackbar(true)
      fecharModal()
      carregarDevedores()
    } catch (e) {
      setErro('Erro ao salvar devedor')
    }
  }

  async function confirmarExclusao() {
  try {
    await api.delete(`/devedores/${devedorExcluir.id}`)

    setMensagemSnackbar('Devedor excluído com sucesso!')
    setSnackbar(true)

    setOpenExcluir(false)
    setDevedorExcluir(null)

    carregarDevedores()
  } catch (e) {
    setMensagemSnackbar('Erro ao excluir devedor')
    setSnackbar(true)
  }
}

      async function confirmarExclusao() {
  try {
    await api.delete(`/devedores/${devedorExcluir.id}`)

    setMensagemSnackbar('Devedor excluído com sucesso!')
    setSnackbar(true)

    setOpenExcluir(false)
    setDevedorExcluir(null)

    carregarDevedores()
  } catch (e) {
    setMensagemSnackbar('Erro ao excluir devedor')
    setSnackbar(true)
  }
}

  return (
    <Container
    maxWidth="lg"
    sx={{
    py: 5,
  }}
>
      <Stack spacing={2}>
        <Typography variant="h4">
          Sistema de Devedores
        </Typography>
        

        <Paper sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">
              Devedores
            </Typography>

            <Button
              variant="contained"
              onClick={abrirModalNovo}
            >
              Novo Devedor
            </Button>
          </Stack>

          <DevedoresTable
            devedores={devedores}
            loading={loading}
            onEditar={abrirModalEditar}
            onExcluir={abrirDialogExcluir}
          />

          <NovoDevedorDialog
            open={openNovoDevedor}
            onClose={fecharModal}
            onSave={salvarDevedor}
            erro={erro}
            setErro={setErro}
            initialData={devedorEditando}
          />

<Dialog
  open={openExcluir}
  onClose={() => setOpenExcluir(false)}
>
  <DialogTitle>Excluir devedor</DialogTitle>

  <DialogContent>
    Tem certeza que deseja excluir{' '}
    <strong>{devedorExcluir?.nome}</strong>?
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenExcluir(false)}>
      Cancelar
    </Button>

    <Button
      color="error"
      variant="contained"
      onClick={confirmarExclusao}
    >
      Excluir
    </Button>
  </DialogActions>
</Dialog>

          <Snackbar
            open={snackbar}
            autoHideDuration={3000}
            onClose={() => setSnackbar(false)}
          >
            <Alert
              severity="success"
              sx={{ width: '100%' }}
            >
              {mensagemSnackbar}
            </Alert>
          </Snackbar>
        </Paper>
      </Stack>
    </Container>
  )
}
