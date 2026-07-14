import { useContext } from 'react'
import { Paper, Stack, Typography, FormControlLabel, Switch } from '@mui/material'
import { SidebarThemeContext } from '../contexts/SidebarThemeContext'

export default function ConfiguracoesPage() {
  const { isDarkSidebar, setIsDarkSidebar } = useContext(SidebarThemeContext)

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Configurações
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={isDarkSidebar}
              onChange={(e) => setIsDarkSidebar(e.target.checked)}
              color="primary"
            />
          }
          label="Modo escuro na barra lateral"
        />
      </Paper>
    </Stack>
  )
}