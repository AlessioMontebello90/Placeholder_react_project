import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Typography, Toolbar, TextField, Button, Stack, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

// Definisci il tipo per un post
interface Post {
  id: number;
  title: string;
  body: string;
}

const PostsTable: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulazione della chiamata API per ottenere i dati dei post
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
      .then(response => response.json())
      .then(data => setPosts(data));
  }, []);

  const handleEdit = (post: Post) => {
    // Logica per l'editing di un post
    console.log('Editing post:', post);
  };

  const handleDelete = (postId: number) => {
    // Logica per eliminare un post
    console.log('Deleting post with id:', postId);
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleView = (post: Post) => {
    // Logica per la visualizzazione di un post
    console.log('Viewing post:', post);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filtro per la ricerca
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper sx={{ margin: '20px', padding: '20px' }}>
      <Toolbar>
        <TextField
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ flex: 1, marginRight: '10px' }}
        />
        <IconButton color="primary">
          <FilterListIcon />
        </IconButton>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ marginLeft: '10px' }}>
          Create
        </Button>
        <Button variant="outlined" color="primary" startIcon={<SaveAltIcon />} sx={{ marginLeft: '10px' }}>
          Export
        </Button>
      </Toolbar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Published At</TableCell>
              <TableCell>Com.</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                <TableCell>{Math.random() > 0.5 ? '✓' : '✕'}</TableCell>
                <TableCell>{Math.floor(Math.random() * 1000)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Chip label="Code" />
                    <Chip label="Music" />
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(post)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(post.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleView(post)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PostsTable;
