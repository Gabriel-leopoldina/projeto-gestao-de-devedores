import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DividasTable from '../components/DividasTable.jsx'

import {
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material'

import { api } from '../services/api.js'

export default function DividasPage() {
  const { id } = useParams()

  const [dividas, setDividas] = useState([])
  const [devedor, setDevedor] = useState(null)
  const [loading, setLoading] = useState(true)

  const [openDialog, setOpenDialog] = useState(false)
  const [openExcluir, setOpenExcluir] = useState(false)

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')

  const [dividaEditando, setDividaEditando] = useState(null)
  const [dividaExcluir, setDividaExcluir] = useState(null)

  async function carregarDevedor() {
    try {
      const { data } = await api.get(`/devedores/${id}`)
      setDevedor(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function carregarDividas() {
    try {
      const { data } = await api.get(`/devedores/${id}/dividas`)
      setDividas(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDevedor()
    carregarDividas()
  }, [])

  async function salvarDivida() {
    try {
      if (dividaEditando) {
        await api.put(`/dividas/${dividaEditando.id}`, {
          descricao,
          valor: Number(valor),
        })
      } else {
        await api.post(`/devedores/${id}/dividas`, {
          descricao,
          valor: Number(valor),
        })
      }

      setDescricao('')
      setValor('')
      setDividaEditando(null)
      setOpenDialog(false)

      carregarDividas()
    } catch (error) {
      console.error(error)
    }
  }

  function abrirModalEditar(divida) {
    setDividaEditando(divida)
    setDescricao(divida.descricao)
    setValor(divida.valor)
    setOpenDialog(true)
  }

  function abrirModalNovaDivida() {
    setDividaEditando(null)
    setDescricao('')
    setValor('')
    setOpenDialog(true)
  }

  function abrirDialogExcluir(divida) {
    setDividaExcluir(divida)
    setOpenExcluir(true)
  }

  async function confirmarExclusao() {
    try {
      await api.delete(`/dividas/${dividaExcluir.id}`)

      setOpenExcluir(false)
      setDividaExcluir(null)

      carregarDividas()
    } catch (error) {
      console.error(error)
    }
  }

  const total = dividas.reduce(
    (acc, divida) => acc + Number(divida.valor),
    0
  )

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 5 }}
    >
      <Stack spacing={3}>
        <Typography
  variant="h4"
  sx={{ mb: 3 }}
>
  Dívidas de {devedor?.nome}
</Typography>

<Paper
  elevation={3}
  sx={{
    p: 3,
    borderRadius: 3,
  }}
>
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{ mb: 2 }}
  >
    <Typography variant="h6">
      Dívidas
    </Typography>

    <Button
      variant="contained"
      onClick={abrirModalNovaDivida}
    >
      Nova Dívida
    </Button>
  </Stack>

  

  <DividasTable
    dividas={dividas}
    loading={loading}
    onEditar={abrirModalEditar}
    onExcluir={abrirDialogExcluir}
  />

  <Typography
    variant="h6"
    sx={{
      mt: 2,
      textAlign: 'right',
      fontWeight: 'bold',
    }}
  >
    Total devido: R$ {total.toFixed(2)}
  </Typography>
</Paper>

        <DividasTable
          dividas={dividas}
          loading={loading}
          onEditar={abrirModalEditar}
          onExcluir={abrirDialogExcluir}
        />

        <Typography
          variant="h6"
          align="right"
        >
          Total devido: R$ {total.toFixed(2)}
        </Typography>
      </Stack>

      
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
          setDividaEditando(null)
          setDescricao('')
          setValor('')
        }}
        fullWidth
        maxWidth="sm"
      >
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
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false)
              setDividaEditando(null)
            }}
          >
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

      {/* Modal Confirmar Exclusão */}
      <Dialog
        open={openExcluir}
        onClose={() => setOpenExcluir(false)}
      >
        <DialogTitle>Excluir Dívida</DialogTitle>

        <DialogContent>
          Tem certeza que deseja excluir a dívida
          <strong> {dividaExcluir?.descricao}</strong>?
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
    </Container>
  )
}