// Importazione di React e dei componenti necessari di MUI per gli elementi dell'interfaccia utente
import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { Paper, Toolbar, TextField, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './PostsTable.css'; // CSS personalizzato per lo stile del componente
import { fetchPosts, updatePost, createPost, deletePost } from './PostService';
import { Post } from './PostTypes';

export function PostsTable() {
  // Stato per memorizzare i post e controllare la visibilità del dialog
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Ref per gestire il post attuale in fase di modifica/creazione e l'input dei tag
  const newPostRef = useRef<Post | null>(null);
  const tagInputRef = useRef<string>('');

  // Recupera i dati iniziali dei post al montaggio del componente e imposta visualizzazioni casuali per ogni post
  useEffect(() => {
    fetchPosts(10).then((data: Post[]) =>
      setPosts(data.map((post: Post) => ({
        ...post,
        tags: [], // Inizializza i tag come vuoti
        views: Math.floor(Math.random() * 1000), // Genera un numero casuale di visualizzazioni
      })))
    );
  }, []);

  // Funzione per aprire il dialog per modificare un post
  const handleEdit = (post: Post) => {
    newPostRef.current = { ...post }; // Imposta i dati del post selezionato
    setDialogOpen(true); // Apre il dialog di modifica
  };

  // Funzione per eliminare un post specifico
  const handleDelete = (postId: number) => {
    deletePost(postId).then(() => {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId)); // Rimuove il post dall'elenco
    });
  };

  // Gestisce la modifica degli input di titolo e corpo del post
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (newPostRef.current) {
      const fieldName = event.target.name as keyof Post;
      const value = event.target.value;

      if (typeof newPostRef.current[fieldName] === 'string') {
        newPostRef.current[fieldName] = value as never;
      }
    }
  };

  // Gestisce la modifica dell'input per i tag
  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    tagInputRef.current = event.target.value;
  };

  // Aggiunge un tag all'elenco dei tag del post
  const handleAddTag = () => {
    if (tagInputRef.current.trim() && newPostRef.current) {
      newPostRef.current.tags = [...newPostRef.current.tags, tagInputRef.current.trim()];
      tagInputRef.current = '';
    }
  };

  // Rimuove un tag specifico dall'elenco dei tag del post
  const handleTagDelete = (tagToDelete: string) => {
    if (newPostRef.current) {
      newPostRef.current.tags = newPostRef.current.tags.filter(tag => tag !== tagToDelete);
    }
  };

  // Gestisce la sottomissione del modulo per creare o aggiornare un post
  const handleFormSubmit = () => {
    if (newPostRef.current) {
      const updatedPost = { ...newPostRef.current };
      if (updatedPost.id) {
        // Aggiorna il post esistente
        updatePost(updatedPost).then((data: Post) => {
          setPosts(prevPosts => prevPosts.map(post => (post.id === data.id ? data : post)));
        });
      } else {
        // Crea un nuovo post con un nuovo ID
        const newId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
        createPost(updatedPost).then((data: Post) => {
          setPosts(prevPosts => [...prevPosts, { ...data, id: newId }]);
        });
      }
    }
    // Reset dell'input tag e chiusura del dialog
    newPostRef.current = null;
    tagInputRef.current = '';
    setDialogOpen(false);
  };

  return (
    <Paper className="PostsTable-container" sx={{ margin: '20px', padding: '20px' }}>
      <Toolbar>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ marginLeft: '10px' }}
          onClick={() => {
            newPostRef.current = { id: 0, title: '', body: '', tags: [], views: Math.floor(Math.random() * 1000) };
            setDialogOpen(true); // Apre il dialog per creare un nuovo post
          }}
        >
          Create
        </Button>
      </Toolbar>

      {/* Dialog per creare/modificare i post */}
      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{newPostRef.current?.id ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        <DialogContent>
          {/* Input per il titolo */}
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            defaultValue={newPostRef.current?.title || ''}
            onChange={handleInputChange}
          />
          {/* Input per il corpo */}
          <TextField
            margin="dense"
            label="Body"
            name="body"
            fullWidth
            defaultValue={newPostRef.current?.body || ''}
            onChange={handleInputChange}
          />
          {/* Input per aggiungere tag */}
          <Stack direction="row" spacing={1} sx={{ marginTop: '10px' }}>
            <TextField margin="dense" label="Add Tag" defaultValue={tagInputRef.current} onChange={handleTagInputChange} />
            <Button onClick={handleAddTag} variant="contained" color="primary">
              Add Tag
            </Button>
          </Stack>
          {/* Elenco dei tag */}
          <Stack direction="row" spacing={1} sx={{ marginTop: '10px' }}>
            {newPostRef.current?.tags.map((tag, index) => (
              <Chip key={index} label={tag} onDelete={() => handleTagDelete(tag)} />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tabella dei post */}
      <TableContainer component={Paper} className="PostsTable-tableContainer">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map(post => (
              <TableRow key={post.id} className="PostsTable-row">
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.views}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {post.tags.map((tag, index) => (
                      <Chip key={index} label={tag} />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  {/* Icona per modifica post */}
                  <IconButton color="primary" onClick={() => handleEdit(post)}>
                    <EditIcon />
                  </IconButton>
                  {/* Icona per eliminazione post */}
                  <IconButton color="secondary" onClick={() => handleDelete(post.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default PostsTable;
