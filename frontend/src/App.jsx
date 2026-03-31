import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button } from '@mui/material';
import DocumentsPage from './pages/DocumentsPage';
import QueryPage from './pages/QueryPage';

const App = () => (
  <BrowserRouter>
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/documents">Documents</Button>
        <Button color="inherit" component={Link} to="/query">Query</Button>
      </Toolbar>
    </AppBar>
    <Container sx={{ mt: 3 }}>
      <Routes>
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/query" element={<QueryPage />} />
        <Route path="/*" element={<DocumentsPage />} />
      </Routes>
    </Container>
  </BrowserRouter>
);

export default App;
