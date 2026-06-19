import { createTheme } from '@mui/material/styles'

export const steamTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#66c0f4',
      light: '#8fd7ff',
      dark: '#2f6f98',
    },
    secondary: {
      main: '#1b9aaa',
    },
    background: {
      default: '#0a1018',
      paper: '#101826',
    },
    text: {
      primary: '#e8f0fa',
      secondary: '#9db0c4',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: [
      'Segoe UI Variable',
      'Segoe UI',
      'Trebuchet MS',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
      letterSpacing: -1.6,
    },
    h2: {
      fontWeight: 800,
      letterSpacing: -1.3,
    },
    h3: {
      fontWeight: 800,
      letterSpacing: -1.1,
    },
    h4: {
      fontWeight: 800,
      letterSpacing: -0.8,
    },
    h5: {
      fontWeight: 800,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      letterSpacing: 0.2,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at top left, rgba(102, 192, 244, 0.16), transparent 36%), radial-gradient(circle at top right, rgba(27, 154, 170, 0.10), transparent 30%), linear-gradient(180deg, #0b111a 0%, #070b10 100%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.03)',
        },
      },
    },
  },
})
