import { useEffect, useState } from 'react'
import { api } from '../services/api'

import DividasTable from '../components/TodasDividasTable' 
import { formatarDocumento } from '../formatadores'

import { Grid, Paper, Typography, Stack, Box, CircularProgress } from '@mui/material'

import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

export default function DashboardPage() {
  const [totais, setTotais] = useState({
    devedores: 0,
    dividas: 0,
    valorTotal: 0,
  })
  

  const [dividasUrgentes, setDividasUrgentes] = useState([])
  const [loading, setLoading] = useState(true)

  async function carregarDashboard() {
    setLoading(true)
    try {
      const [respostaDividas, respostaDevedores] = await Promise.all([
        api.get('/dividas'),
        api.get('/devedores')
      ])

      const dividas = respostaDividas.data
      const devedores = respostaDevedores.data

  
      const somaValores = dividas.reduce((acumulador, divida) => {
        return acumulador + Number(divida.valor || 0)
      }, 0)

      setTotais({
        devedores: devedores.length,
        dividas: dividas.length,
        valorTotal: somaValores,
      })

      
      const urgentes = dividas
        .filter((d) => d.status !== 'PAGA') 
        .sort((a, b) => {
          
          const dataA = new Date(a.data_vencimento || a.dataVencimento || a.vencimento)
          const dataB = new Date(b.data_vencimento || b.dataVencimento || b.vencimento)
          return dataA - dataB
        })
        .slice(0, 5)

      setDividasUrgentes(urgentes)

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDashboard()
  }, [])

  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: '50vh' }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <Stack spacing={4} sx={{ p: 3 }}>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        color="text.primary"
        sx={{ mt: { xs: 8, sm: 0 } }}
      >
        Dashboard
      </Typography>

    
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', bgcolor: '#2196f3', color: 'white', borderRadius: 2 }}>
            <PeopleOutlineIcon sx={{ fontSize: 50, mr: 2, opacity: 0.9 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">{totais.devedores}</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>Total de Devedores</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', bgcolor: '#ff9800', color: 'white', borderRadius: 2 }}>
            <ReceiptLongIcon sx={{ fontSize: 50, mr: 2, opacity: 0.9 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">{totais.dividas}</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>Dívidas</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', bgcolor: '#4caf50', color: 'white', borderRadius: 2 }}>
            <AttachMoneyIcon sx={{ fontSize: 50, mr: 2, opacity: 0.9 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">{formatarMoeda(totais.valorTotal)}</Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>Valor Total Devido</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          Ações Urgentes (Próximos Vencimentos)
        </Typography>

       
        <DividasTable
          dividas={dividasUrgentes}
          loading={false} 
          mostrarDevedor={true}
        />
      </Stack>
    </Stack>
  )
}