import {
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Stack,
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import { formatarDocumento } from '../formatadores'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'



function formatarTelefone(telefone) {
  if (!telefone) return ''

  const numero = telefone.replace(/\D/g, '')

  if (numero.length === 11) {
    return numero.replace(
      /(\d{2})(\d{5})(\d{4})/,
      '($1) $2-$3'
    )
  }

  if (numero.length === 10) {
    return numero.replace(
      /(\d{2})(\d{4})(\d{4})/,
      '($1) $2-$3'
    )
  }

  return telefone
}

export default function DevedoresTable({
  devedores,
  loading,
  onEditar,
  onExcluir,
}) {
  if (loading) {
    return <CircularProgress />
  }

  const rows = devedores.map((devedor) => ({
  id: devedor.id,
  nome: devedor.nome,
  documento: devedor.cpf || devedor.cnpj,
  telefone: devedor.telefone,
  original: devedor,
}))

  const navigate = useNavigate()

  const columns = [ 
  {
    field: 'nome',
    headerName: 'Nome',
    flex: 1,
    minWidth: 180,
  },

  {
  field: 'documento',
  headerName: 'CPF/CNPJ',
  flex: 1,
  minWidth: 180,

   renderCell: (params) => (
    formatarDocumento(params.value)
  ),
},

  {
  field: 'telefone',
  headerName: 'Telefone',
  flex: 1,
  minWidth: 150,

  renderCell: (params) => (
    formatarTelefone(params.value)
  ),
},

  {
    field: 'acoes',
    headerName: 'Ações',
    width: 180,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    filterable: false,

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
      onClick={() => onEditar(params.row.original)}
    >
      <EditIcon />
    </IconButton>

    <IconButton
      color="error"
      onClick={() => onExcluir(params.row.original)}
    >
      <DeleteIcon />
    </IconButton>

    <IconButton
      color="success"
      onClick={() =>
        navigate(`/devedores/${params.row.id}/dividas`)
      }
    >
      <VisibilityIcon />
    </IconButton>
  </Stack>
  ),
  },
]

if (rows.length === 0) {
  return (
    <Typography>
      Nenhum devedor cadastrado.
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