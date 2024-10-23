import React, { useState, useEffect, ChangeEvent } from 'react';
import { Paper, Toolbar, TextField, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import './PostsTable.css';

// Definizione dell'interfaccia per il tipo di dato Post
interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  views: number;
}

const PostsTable: React.FC = () => {
  // Stato per i post
  const [posts, setPosts] = useState<Post[]>([]);
  // Stato per la query di ricerca
  const [searchQuery, setSearchQuery] = useState('');
  // Stato per aprire/chiudere il form di creazione/modifica
  const [openForm, setOpenForm] = useState(false);
  // Stato per aprire/chiudere l'anteprima del post
  const [openPreview, setOpenPreview] = useState(false);
  // Stato per determinare se stiamo modificando un post esistente
  const [isEditing, setIsEditing] = useState(false);
  // Stato per l'ID del post corrente in modifica
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  // Stato per il nuovo post o il post in modifica
  const [newPost, setNewPost] = useState<Post>({ id: 0, title: '', body: '', tags: [], views: 0 });
  // Stato per il post in anteprima
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  // Stato per l'input del tag
  const [tagInput, setTagInput] = useState('');

  // Effetto per caricare i post all'inizio (simulazione di una chiamata API)
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
      .then(response => response.json())
      .then(data => setPosts(data.map((post: any) => ({
        ...post,
        tags: [],
        views: Math.floor(Math.random() * 1000),
      }))));
  }, []);

  // Gestisce la modifica di un post
  const handleEdit = (post: Post) => {
    setIsEditing(true);
    setCurrentPostId(post.id);
    setNewPost(post);
    setOpenForm(true);
  };

  // Gestisce l'eliminazione di un post
  const handleDelete = (postId: number) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  // Gestisce la visualizzazione dell'anteprima di un post
  const handleView = (post: Post) => {
    setPreviewPost(post);
    setOpenPreview(true);
  };

  // Gestisce il cambiamento dell'input di ricerca
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Gestisce il click per creare un nuovo post
  const handleCreateClick = () => {
    setIsEditing(false);
    setNewPost({ id: 0, title: '', body: '', tags: [], views: Math.floor(Math.random() * 1000) });
    setOpenForm(true);
  };

  // Chiude il form di creazione/modifica
  const handleFormClose = () => {
    setOpenForm(false);
    setNewPost({ id: 0, title: '', body: '', tags: [], views: 0 });
    setTagInput('');
  };

  // Chiude l'anteprima del post
  const handlePreviewClose = () => {
    setOpenPreview(false);
    setPreviewPost(null);
  };

  // Gestisce il cambiamento degli input del form di creazione/modifica
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewPost(prevState => ({ ...prevState, [name]: value }));
  };

  // Gestisce il cambiamento dell'input per i tag
  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  // Aggiunge un tag al post
  const handleAddTag = () => {
    if (tagInput.trim()) {
      setNewPost(prevState => ({
        ...prevState,
        tags: [...prevState.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  // Elimina un tag dal post
  const handleTagDelete = (tagToDelete: string) => {
    setNewPost(prevState => ({
      ...prevState,
      tags: prevState.tags.filter(tag => tag !== tagToDelete),
    }));
  };

  // Gestisce l'invio del form di creazione/modifica
  const handleFormSubmit = () => {
    if (isEditing && currentPostId !== null) {
      setPosts(prevPosts => prevPosts.map(post => (post.id === currentPostId ? { ...post, ...newPost } : post)));
    } else {
      const newId = posts.length ? Math.max(...posts.map(post => post.id)) + 1 : 1;
      setPosts(prevPosts => [...prevPosts, { ...newPost, id: newId }]);
    }
    handleFormClose();
  };

  // Filtra i post in base alla query di ricerca
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper className="PostsTable-container" sx={{ margin: '20px', padding: '20px' }}>
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
      </Toolbar>

      <Dialog open={openForm} onClose={handleFormClose} fullWidth>
        <DialogTitle>{isEditing ? 'Edit Post' : 'Create New Post'}</DialogTitle>
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

      <Dialog open={openPreview} onClose={handlePreviewClose} fullWidth>
        <DialogTitle>Post Preview</DialogTitle>
        <DialogContent>
          {previewPost && (
            <>
              <Typography variant="h6" gutterBottom>
                {previewPost.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {previewPost.body}
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                Views: {previewPost.views}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ marginTop: '10px' }}>
                {previewPost.tags.map((tag, index) => (
                  <Chip key={index} label={tag} />
                ))}
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} className="PostsTable-tableContainer">
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
              <TableRow key={post.id} className="PostsTable-row">
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                <TableCell>{Math.random() > 0.5 ? '✓' : '✕'}</TableCell>
                <TableCell>{post.views}</TableCell>
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
