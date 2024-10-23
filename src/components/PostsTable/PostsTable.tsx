import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Typography, Toolbar, TextField, Button, Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions
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
  tags: string[];  // Aggiunto il campo tags come array di stringhe
}

const PostsTable: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', tags: [] as string[] });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    // Simulazione della chiamata API per ottenere i dati dei post
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
      .then(response => response.json())
      .then(data => setPosts(data.map((post: any) => ({ ...post, tags: [] }))));
  }, []);

  const handleEdit = (post: Post) => {
    console.log('Editing post:', post);
  };

  const handleDelete = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleView = (post: Post) => {
    console.log('Viewing post:', post);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateClick = () => {
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setNewPost({ title: '', body: '', tags: [] });
    setTagInput('');  // Resetta il campo tag
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewPost(prevState => ({ ...prevState, [name]: value }));
  };

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setNewPost(prevState => ({
        ...prevState,
        tags: [...prevState.tags, tagInput.trim()],
      }));
      setTagInput(''); // Resetta l'input dopo aver aggiunto una tag
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setNewPost(prevState => ({
      ...prevState,
      tags: prevState.tags.filter(tag => tag !== tagToDelete),
    }));
  };

  const handleFormSubmit = () => {
    const newId = posts.length ? Math.max(...posts.map(post => post.id)) + 1 : 1;
    const postToAdd = { ...newPost, id: newId };
    setPosts([...posts, postToAdd]);
    handleFormClose();
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ marginLeft: '10px' }}
          onClick={handleCreateClick}
        >
          Create
        </Button>
        <Button variant="outlined" color="primary" startIcon={<SaveAltIcon />} sx={{ marginLeft: '10px' }}>
          Export
        </Button>
      </Toolbar>

      {/* Dialog per il form di creazione */}
      <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={newPost.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Body"
            name="body"
            fullWidth
            value={newPost.body}
            onChange={handleInputChange}
          />

          {/* Sezione per aggiungere le tag */}
          <Stack direction="row" spacing={1} sx={{ marginTop: '10px' }}>
            <TextField
              margin="dense"
              label="Add Tag"
              value={tagInput}
              onChange={handleTagInputChange}
            />
            <Button onClick={handleAddTag} variant="contained" color="primary">
              Add Tag
            </Button>
          </Stack>

          {/* Visualizza le tag */}
          <Stack direction="row" spacing={1} sx={{ marginTop: '10px' }}>
            {newPost.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleTagDelete(tag)}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

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
                    {post.tags.map((tag, index) => (
                      <Chip key={index} label={tag} />
                    ))}
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
