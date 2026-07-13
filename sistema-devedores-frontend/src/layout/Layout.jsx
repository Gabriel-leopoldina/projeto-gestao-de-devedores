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
            // 1. Transformamos o Drawer em um container flexível em coluna
            display: 'flex',
            flexDirection: 'column', 
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

          <ListItemButton component={Link} to="/devedores">
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Devedores" />
          </ListItemButton>

          <ListItemButton component={Link} to="/dividas">
            <ListItemIcon>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Dívidas" />
          </ListItemButton>
        </List>

        {/* 2. Envolvemos em um List com mt: 'auto' para jogar lá pro final */}
        <List sx={{ mt: 'auto' }}>
          <ListItemButton component={Link} to="/configuracoes">
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