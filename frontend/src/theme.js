import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    secondary: { main: '#f57c00' },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans TC", sans-serif',
  },
});

export default theme;
