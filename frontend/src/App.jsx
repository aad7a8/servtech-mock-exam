import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import theme from './theme';
import DocumentsPage from './pages/DocumentsPage';
import QueryPage from './pages/QueryPage';

function NavBar() {
  const location = useLocation();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ServTech Knowledge Base
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/documents"
          variant={location.pathname.startsWith('/documents') ? 'outlined' : 'text'}
        >
          Documents
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/query"
          variant={location.pathname === '/query' ? 'outlined' : 'text'}
        >
          Query
        </Button>
      </Toolbar>
    </AppBar>
  );
}

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Routes>
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/*" element={<DocumentsPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
