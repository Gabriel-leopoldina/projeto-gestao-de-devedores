import {
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Stack,
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function DividasTable({
  dividas,
  loading,
  onEditar,
  onExcluir,
}) {
  if (loading) {
    return <CircularProgress />
  }

  const rows = dividas.map((divida) => ({
    id: divida.id,
    descricao: divida.descricao,
    valor: Number(divida.valor).toFixed(2),
    original: divida,
  }))

  const columns = [
    {
      field: 'descricao',
      headerName: 'Descrição',
      flex: 1,
      minWidth: 250,
    },

    {
      field: 'valor',
      headerName: 'Valor',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <>R$ {params.value}</>
      ),
    },

    {
      field: 'acoes',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      filterable: false,

      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
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
        </Stack>
      ),
    },
  ]

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
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
      />
    </Paper>
  )
}