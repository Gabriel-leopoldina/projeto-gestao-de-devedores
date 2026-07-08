import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DividasTable from '../components/DividasTable.jsx'
import {
  Typography,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  MenuItem,
  Snackbar, 
  Alert,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { api } from '../services/api.js'

export default function DividasPage() {
  const { id } = useParams()
  const [dividas, setDividas] = useState([])
  const [dividasFiltradas, setDividasFiltradas] = useState([])
  const [devedor, setDevedor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [openExcluir, setOpenExcluir] = useState(false)
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [dataVencimento, setDataVencimento] = useState('')
  const [status, setStatus] = useState('PENDENTE')
  const [campoPesquisa, setCampoPesquisa] = useState('descricao')
  const [pesquisa, setPesquisa] = useState('')
  const [dividaEditando, setDividaEditando] = useState(null)
  const [dividaExcluir, setDividaExcluir] = useState(null)

  const [erro, setErro] = useState('') 

  async function carregarDevedor() {
    try {
      const { data } = await api.get(`/devedores/${id}`)
      setDevedor(data)
    } catch (err) {
      setErro('Erro ao carregar os dados do devedor.')
    }
  }

  async function carregarDividas() {
    setLoading(true)
    try {
      const { data } = await api.get(`/devedores/${id}/dividas`)
      setDividas(data)
      setDividasFiltradas(data)
    } catch (err) {
      setErro('Erro ao carregar a lista de dívidas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDevedor()
    carregarDividas()
  }, [id])

  function limparFormulario() {
    setDividaEditando(null)
    setDescricao('')
    setValor('')
    setDataVencimento('')
    setStatus('PENDENTE')
  }

  function abrirModalNovaDivida() {
    limparFormulario()
    setOpenDialog(true)
  }

  function abrirModalEditar(divida) {
    setDividaEditando(divida)
    setDescricao(divida.descricao || '')
    setValor(divida.valor || '')

    const dataBruta = divida.data_vencimento || divida.dataVencimento || divida.vencimento
    
    let dataFormatada = ''
    
    if (dataBruta) {
      const dataString = String(dataBruta).trim()
      
      if (dataString.includes('/')) {
        const [dia, mes, ano] = dataString.split('/')
        dataFormatada = `${ano.substring(0,4)}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
      } else if (dataString.includes('-') && dataString.split('-')[0].length === 2) {
        const [dia, mes, ano] = dataString.split('-')
        dataFormatada = `${ano.substring(0,4)}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
      } else if (dataString.includes('T')) {
        dataFormatada = dataString.split('T')[0]
      } else {
        dataFormatada = dataString.substring(0, 10)
      }
    }
    
    setDataVencimento(dataFormatada)
    setStatus(divida.status || 'PENDENTE')
    setOpenDialog(true)
  }

  function fecharModal() {
    setOpenDialog(false)
    limparFormulario()
  }

  function abrirDialogExcluir(divida) {
    setDividaExcluir(divida)
    setOpenExcluir(true)
  }

  function fecharDialogExcluir() {
    setOpenExcluir(false)
    setDividaExcluir(null)
  }

  function pesquisar() {
    const texto = pesquisa.trim().toLowerCase()
    if (!texto) {
      setDividasFiltradas(dividas)
      return
    }
    const resultado = dividas.filter((divida) => {
      switch (campoPesquisa) {
        case 'descricao':
          return divida.descricao?.toLowerCase().includes(texto)
        case 'valor':
          return String(divida.valor).includes(texto)
        case 'data_vencimento':
          return divida.data_vencimento?.includes(texto)
        case 'status':
          return divida.status?.toLowerCase().includes(texto)
        default:
          return true
      }
    })
    setDividasFiltradas(resultado)
  }

  function limparPesquisa() {
    setPesquisa('')
    setDividasFiltradas(dividas)
  }

  async function salvarDivida() {
    try {
      let dataCorrigida = dataVencimento;
      if (dataVencimento && dataVencimento.length === 10) {
        dataCorrigida = `${dataVencimento}T12:00:00.000Z`;
      }

      const payload = {
        descricao,
        valor: Number(valor),
        data_vencimento: dataCorrigida, 
        status,
      }

      if (dividaEditando) {
        await api.put(`/dividas/${dividaEditando.id}`, payload)
      } else {
        await api.post(`/devedores/${id}/dividas`, payload)
      }
      
      fecharModal()
      carregarDividas()
    } catch (err) {
      setErro('Erro ao salvar dívida. Tente novamente.')
    }
  }

  async function confirmarExclusao() {
    try {
      await api.delete(`/dividas/${dividaExcluir.id}`)
      fecharDialogExcluir()
      carregarDividas()
    } catch (err) {
      setErro('Erro ao excluir dívida. Tente novamente.')
    }
  }

  const total = dividasFiltradas.reduce(
    (acc, divida) => acc + Number(divida.valor || 0),
    0
  )

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ pt: 5 }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <>
      <Stack spacing={3} sx={{ mt: 3, px: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">
            Dívidas de {devedor?.nome}
          </Typography>

          <Button
            variant="contained"
            sx={{ minWidth: 160 }}
            onClick={abrirModalNovaDivida}
          >
            Nova Dívida
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
            <MenuItem value="descricao">Descrição</MenuItem>
            <MenuItem value="valor">Valor</MenuItem>
            <MenuItem value="data_vencimento">Vencimento</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </TextField>

          <TextField
            label="Pesquisar"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') pesquisar()
            }}
            fullWidth
          />

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={pesquisar}
            sx={{ minWidth: 160 }}
          >
            Pesquisar
          </Button>
        </Stack>

        <DividasTable
          dividas={dividasFiltradas}
          loading={loading}
          onEditar={abrirModalEditar}
          onExcluir={abrirDialogExcluir}
        />

        <Typography
          sx={{
            mt: 2,
            textAlign: 'right',
            fontWeight: 'bold',
          }}
        >
          Total: R$ {total.toFixed(2)}
        </Typography>
      </Stack>

      <Dialog open={openDialog} onClose={fecharModal}>
        <DialogTitle>
          {dividaEditando ? 'Editar Dívida' : 'Nova Dívida'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
            />

            <TextField
              label="Valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              fullWidth
            />

            <TextField
              type="date"
              label="Vencimento"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="PENDENTE">Pendente</MenuItem>
              <MenuItem value="PAGA">Paga</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={fecharModal}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={salvarDivida}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openExcluir} onClose={fecharDialogExcluir}>
        <DialogTitle>
          Excluir dívida?
        </DialogTitle>

        <DialogContent>
          Tem certeza que deseja excluir esta dívida?
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
        open={!!erro} 
        autoHideDuration={5000} 
        onClose={() => setErro('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setErro('')} severity="error" sx={{ width: '100%' }}>
          {erro}
        </Alert>
      </Snackbar>
    </>
  )
}