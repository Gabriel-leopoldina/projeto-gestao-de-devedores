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
  IconButton,
  Tooltip
} from '@mui/material'

import GroupIcon from '@mui/icons-material/Group'
import HomeIcon from '@mui/icons-material/Home'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import SettingsIcon from '@mui/icons-material/Settings'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'

const drawerWidth = 220

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDarkSidebar } = useContext(SidebarThemeContext)

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Devedores
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        
            <Tooltip title="Cadastrar Usuário">
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/cadastrar-usuario')}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <AccountCircleOutlinedIcon sx={{ fontSize: '26px' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Sair">
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ExitToAppOutlinedIcon sx={{ fontSize: '28px' }} />
              </IconButton>
            </Tooltip>
          </Box>
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

            backgroundColor: isDarkSidebar ? '#1e1e1e' : '#ffffff',
            color: isDarkSidebar ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',

            '& .MuiListItemText-root': {
              color: isDarkSidebar ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
            },

            '& .MuiListItemIcon-root': {
              color: isDarkSidebar ? '#a1a1aa' : 'rgba(0, 0, 0, 0.54)',
            },

            '& .Mui-selected': {
              backgroundColor: isDarkSidebar ? 'rgba(255, 255, 255, 0.08) !important' : 'rgba(25, 118, 210, 0.08) !important',
              
              '& .MuiListItemText-root': {
                color: isDarkSidebar ? '#90caf9 !important' : '#1976d2 !important',
              },
              '& .MuiListItemIcon-root': {
                color: isDarkSidebar ? '#90caf9 !important' : '#1976d2 !important',
              }
            },
            
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