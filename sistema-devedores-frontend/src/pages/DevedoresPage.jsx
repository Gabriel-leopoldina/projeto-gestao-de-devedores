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
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { api } from '../services/api.js'
import DevedoresTable from '../components/DevedoresTable.jsx'
import NovoDevedorDialog from '../components/NovoDevedorDialog.jsx'

export default function DevedoresPage() {
  const [devedores, setDevedores] = useState([])
  const [devedoresFiltrados, setDevedoresFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [campoPesquisa, setCampoPesquisa] = useState('nome')
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
      setDevedoresFiltrados([...data])
    } catch (e) {
      setErro('Erro ao carregar devedores')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    carregarDevedores()
  }, [])
  
  function abrirModalNovo() {
    setErro('')
    setDevedorEditando(null)
    setOpenNovoDevedor(true)
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

  function abrirDialogExcluir(devedor) {
    setDevedorExcluir(devedor)
    setOpenExcluir(true)
  }

  function fecharDialogExcluir() {
    setOpenExcluir(false)
    setDevedorExcluir(null)
  }
  
  
  async function pesquisar() {
    setLoading(true)
    try {
      const { data } = await api.get('/devedores', {
        params: {
          campo: campoPesquisa,
          pesquisa,
        },
      })
      setDevedores(data)
      setDevedoresFiltrados(data)
    } catch (err) {
      console.error(err)
      setErro('Erro ao realizar a pesquisa.')
    } finally {
      setLoading(false)
    }
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
      fecharDialogExcluir()
      carregarDevedores()
    } catch (e) {
      setMensagemSnackbar('Erro ao excluir devedor')
      setSnackbar(true)
    }
  }

  return (
    <Stack spacing={2}>
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
            sx={{
              minWidth: 170,
              borderRadius: 1,
            }}
          >
            Novo Devedor
          </Button>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <TextField
            select
            label="Filtrar por"
            value={campoPesquisa}
            onChange={(e) => setCampoPesquisa(e.target.value)}
            sx={{ width: 180 }}
          >
            <MenuItem value="nome">Nome</MenuItem>
            <MenuItem value="documento">CPF/CNPJ</MenuItem>
            <MenuItem value="telefone">Telefone</MenuItem>
          </TextField>

          <TextField
            label="Pesquisar"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                pesquisar()
              }
            }}
            fullWidth
          />

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={pesquisar}
            sx={{
              minWidth: 170,
              borderRadius: 1,
            }}
          >
            Pesquisar
          </Button>
        </Stack>

        <DevedoresTable
          devedores={devedoresFiltrados}
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
          onClose={fecharDialogExcluir}
        >
          <DialogTitle>
            Excluir devedor
          </DialogTitle>
          <DialogContent>
            Tem certeza que deseja excluir{' '}
            <strong>{devedorExcluir?.nome}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={fecharDialogExcluir}>
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
            severity={mensagemSnackbar.includes('Erro') ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {mensagemSnackbar}
          </Alert>
        </Snackbar>
      </Paper>
    </Stack>
  )
}