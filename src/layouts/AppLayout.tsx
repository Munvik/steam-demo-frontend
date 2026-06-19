import { AppBar, Box, Button, Container, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography, useMediaQuery } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { GamepadRounded, StorefrontRounded, LibraryBooksRounded, AddCircleOutlineRounded } from '@mui/icons-material'
import { NavLink, Outlet } from 'react-router-dom'

const drawerWidth = 280

const navItems = [
  { label: 'Store', to: '/', icon: <StorefrontRounded /> },
  { label: 'Library', to: '/library', icon: <LibraryBooksRounded /> },
  { label: 'Add Game', to: '/games/create', icon: <AddCircleOutlineRounded /> },
]

const Main = styled('main')(({ theme }) => ({
  flex: 1,
  minHeight: '100vh',
  paddingTop: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    marginLeft: drawerWidth,
  },
}))

export const AppLayout = () => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background:
          'linear-gradient(180deg, rgba(15, 24, 36, 0.98) 0%, rgba(10, 15, 24, 1) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar sx={{ px: 3, minHeight: 88 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #66c0f4 0%, #1b9aaa 100%)',
              color: '#06131d',
            }}
          >
            <GamepadRounded />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
              Steam Forge
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Store and Library
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
      <List sx={{ px: 1.5, gap: 0.8, display: 'grid' }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            sx={{
              borderRadius: 2.5,
              color: 'text.secondary',
              '& .MuiListItemText-primary': { fontWeight: 700 },
              '&.active': {
                backgroundColor: 'rgba(102, 192, 244, 0.12)',
                color: 'primary.light',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 3 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: 'linear-gradient(180deg, rgba(102, 192, 244, 0.10), rgba(27, 154, 170, 0.06))',
            border: '1px solid rgba(102, 192, 244, 0.16)',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }} gutterBottom>
            Connected backend
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Live data is loaded from the ASP.NET Core API on localhost:7226.
          </Typography>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background:
            'linear-gradient(180deg, rgba(12, 18, 27, 0.96) 0%, rgba(10, 15, 24, 0.88) 100%)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Toolbar sx={{ minHeight: 88, px: 3 }}>
          <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Steam Forge
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Steam-inspired frontend powered by your ASP.NET Core backend
              </Typography>
            </Box>
            <Button variant="outlined" color="primary" size="small">
              {mobile ? 'Mobile layout' : 'Desktop layout'}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {mobile ? null : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Main>
        <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, md: 4 } }}>
          <Outlet />
        </Container>
      </Main>
    </Box>
  )
}
