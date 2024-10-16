import React from 'react';
import PostsTable from './components/PostsTable/PostsTable';
import './App.css';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

function App() {
  return (
    <div className="App">
      {/* Barra di navigazione */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            JSONPlaceholder App
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container>
        <PostsTable />
      </Container>
    </div>
  );
}

export default App;
