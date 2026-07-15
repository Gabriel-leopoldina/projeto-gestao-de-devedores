import {
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Stack,
  Chip,
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function DividasTable({
  dividas,
  loading,
  onEditar,
  onExcluir,
  mostrarDevedor = false,
}) {
  if (loading) {
    return <CircularProgress />
  }

  function formatarDataBrasileira(dataString) {
    if (!dataString) return '-'

    const dataBruta = String(dataString).trim()
    const apenasData = dataBruta.split('T')[0] 

    if (apenasData.includes('-')) {
      const [ano, mes, dia] = apenasData.split('-')
      return `${dia}/${mes}/${ano}`
    }

    return apenasData
  }

  function obterStatus(divida) {
    if (divida.status === 'PAGA') {
      return {
        texto: 'Paga',
        cor: 'success',
      }
    }

    const dataVenc = divida.data_vencimento || divida.dataVencimento || divida.vencimento

    if (!dataVenc) {
      return {
        texto: 'Pendente',
        cor: 'warning',
      }
    }

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    let dataCorrigida = String(dataVenc).split('T')[0]
    const vencimento = new Date(`${dataCorrigida}T12:00:00`)
    vencimento.setHours(0, 0, 0, 0)

    if (vencimento < hoje) {
      return {
        texto: 'Atrasada',
        cor: 'error',
      }
    }

    return {
      texto: 'Pendente',
      cor: 'warning',
    }
  }

  const rows = dividas.map((divida) => ({
    id: divida.id,

    devedor: divida.devedor?.nome || '',
    cpfCnpj: divida.devedor?.cpf || divida.devedor?.cnpj || '',

    descricao: divida.descricao,
    
    // 🎯 Mantém como Número puro para a ordenação da coluna funcionar perfeitamente
    valor: Number(divida.valor || 0), 

    data_vencimento:
      divida.data_vencimento ||
      divida.dataVencimento ||
      divida.vencimento,

    status: divida.status,

    original: divida,
  }))

  const columns = [
    {
      field: 'descricao',
      headerName: 'Descrição',
      flex: 1.5,
      minWidth: 220,
    },
    {
      field: 'valor',
      headerName: 'Valor',
      flex: 1,
      minWidth: 120,
      
      renderCell: (params) => {
        return (
          <>
            {params.value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </>
        )
      },
    },
    {
      field: 'data_vencimento',
      headerName: 'Vencimento',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => formatarDataBrasileira(params.value),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const status = obterStatus(params.row.original)

        return (
          <Chip
            label={status.texto}
            color={status.cor}
            size="small"
          />
        )
      },
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100%' }}
        >
          <IconButton
            color="primary"
            onClick={() => onEditar?.(params.row.original)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => onExcluir?.(params.row.original)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ]

  if (mostrarDevedor) {
    columns.unshift(
      {
        field: 'cpfCnpj',
        headerName: 'CPF/CNPJ',
        flex: 1,
        minWidth: 170,
      },
      {
        field: 'devedor',
        headerName: 'Devedor',
        flex: 1.5,
        minWidth: 220,
      }
    )
  }

  if (rows.length === 0) {
    return (
      <Typography>
        Nenhuma dívida cadastrada.
      </Typography>
    )
  }

  return (
    <Paper sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        sx={{ border: 0 }}
      />
    </Paper>
  )
}