import { useContext } from 'react'
import { SidebarThemeContext } from '../contexts/SidebarThemeContext'

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  Box,
} from '@mui/material'

import GroupIcon from '@mui/icons-material/Group'
import HomeIcon from '@mui/icons-material/Home'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import SettingsIcon from '@mui/icons-material/Settings'

import { Outlet, Link, useLocation } from 'react-router-dom'

const drawerWidth = 220

export default function Layout() {
  const location = useLocation()
  const { isDarkSidebar } = useContext(SidebarThemeContext)

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
        }}
      >
        <Toolbar>
          <Typography variant="h6">
            Sistema de Devedores
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',

            // 1. Cores de fundo e textos principais bem definidas para ambos os modos
            backgroundColor: isDarkSidebar ? '#1e1e1e' : '#ffffff',
            color: isDarkSidebar ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',

            // 2. Garante a cor correta para o texto de dentro dos itens
            '& .MuiListItemText-root': {
              color: isDarkSidebar ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
            },

            // 3. Ajuste para a cor dos ícones normais
            '& .MuiListItemIcon-root': {
              color: isDarkSidebar ? '#a1a1aa' : 'rgba(0, 0, 0, 0.54)',
            },

            // 4. Estilos do botão quando estiver selecionado (ativo)
            '& .Mui-selected': {
              backgroundColor: isDarkSidebar ? 'rgba(255, 255, 255, 0.08) !important' : 'rgba(25, 118, 210, 0.08) !important',
              
              '& .MuiListItemText-root': {
                color: isDarkSidebar ? '#90caf9 !important' : '#1976d2 !important',
              },
              '& .MuiListItemIcon-root': {
                color: isDarkSidebar ? '#90caf9 !important' : '#1976d2 !important',
              }
            },
            
            // 5. Ajuste para o hover (passar o mouse)
            '& .MuiListItemButton-root:hover': {
               backgroundColor: isDarkSidebar ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'
            }
          },
        }}
      >
        <Toolbar />

        <List>
          <ListItemButton
            component={Link}
            to="/"
            selected={location.pathname === '/'}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Início" />
          </ListItemButton>

          <ListItemButton 
            component={Link} 
            to="/devedores"
            selected={location.pathname === '/devedores'}
          >
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Devedores" />
          </ListItemButton>

          <ListItemButton 
            component={Link} 
            to="/dividas"
            selected={location.pathname === '/dividas'}
          >
            <ListItemIcon>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Dívidas" />
          </ListItemButton>
        </List>

        <List sx={{ mt: 'auto' }}>
          <ListItemButton 
            component={Link} 
            to="/configuracoes"
            selected={location.pathname === '/configuracoes'}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}