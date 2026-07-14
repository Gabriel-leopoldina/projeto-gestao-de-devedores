import { useEffect, useState } from 'react'
import {
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import DividasTable from '../components/TodasDividasTable'
import { api } from '../services/api'

export default function TodasDividasPage() {
  const [dividas, setDividas] = useState([])
  const [dividasFiltradas, setDividasFiltradas] = useState([])
  const [loading, setLoading] = useState(true)

  const [campoPesquisa, setCampoPesquisa] = useState('descricao')
  const [pesquisa, setPesquisa] = useState('')

  async function carregarDividas() {
    setLoading(true)

    try {
      const { data } = await api.get('/dividas')

      setDividas(data)
      setDividasFiltradas(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDividas()
  }, [])

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

        case 'devedor':
          return divida.devedor?.nome?.toLowerCase().includes(texto)

        case 'status':
          return divida.status?.toLowerCase().includes(texto)

        default:
          return true
      }
    })

    setDividasFiltradas(resultado)
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">
        Todas as Dívidas
      </Typography>

      <Stack direction="row" spacing={2}>
        <TextField
          select
          label="Filtrar por"
          value={campoPesquisa}
          onChange={(e) => setCampoPesquisa(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="descricao">Descrição</MenuItem>
          <MenuItem value="devedor">Devedor</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Pesquisar"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              pesquisar()
            }
          }}
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
        mostrarDevedor={true}
      />
    </Stack>
  )
}