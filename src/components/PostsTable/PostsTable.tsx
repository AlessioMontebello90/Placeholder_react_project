// PostsTable.tsx
import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { Paper, Toolbar, TextField, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './PostsTable.css';
import { fetchPosts, updatePost, createPost, deletePost } from './PostService'; // Importa le funzioni per gestire le chiamate API
import { Post } from './PostTypes'; // Importa il tipo Post

export function PostsTable() {
  const [posts, setPosts] = useState<Post[]>([]); // Array per salvare tutti i post
  const [isDialogOpen, setDialogOpen] = useState(false); // Stato per sapere se il dialog è aperto o chiuso
  const newPostRef = useRef<Post | null>(null); // Riferimento al post che stiamo creando o modificando
  const tagInputRef = useRef<string>(''); // Riferimento per il valore del campo tag

  // Carica i post iniziali una volta al montaggio del componente
  useEffect(() => {
    fetchPosts(10).then((data: Post[]) =>
      setPosts(data.map((post: Post) => ({
        ...post,
        tags: [], // Aggiunge un array vuoto per i tag ad ogni post
        views: Math.floor(Math.random() * 1000), // Genera un numero casuale di visualizzazioni per simulare i dati
      })))
    );
  }, []);

  // Funzione per gestire la modifica di un post
  const handleEdit = (post: Post) => {
    newPostRef.current = { ...post }; // Crea una copia del post da modificare e lo assegna al riferimento
    setDialogOpen(true); // Apre il dialog per la modifica del post
  };

  // Funzione per gestire l'eliminazione di un post
  const handleDelete = (postId: number) => {
    deletePost(postId).then(() => {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId)); // Rimuove il post dallo stato usando il suo ID
    });
  };

  // Funzione per gestire il cambiamento degli input del form (titolo e corpo del post)
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (newPostRef.current) {
      const fieldName = event.target.name as keyof Post;
      const value = event.target.value;

      if (typeof newPostRef.current[fieldName] === 'string') {
        newPostRef.current[fieldName] = value as never; // Aggiorna il valore del campo del post in base all'input dell'utente
      }
    }
  };

  // Funzione per gestire il cambiamento dell'input per i tag
  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    tagInputRef.current = event.target.value; // Aggiorna il riferimento per il valore del tag
  };

  // Funzione per aggiungere un nuovo tag al post
  const handleAddTag = () => {
    if (tagInputRef.current.trim() && newPostRef.current) {
      newPostRef.current.tags = [...newPostRef.current.tags, tagInputRef.current.trim()]; // Aggiunge il nuovo tag all'array dei tag del post corrente
      tagInputRef.current = ''; // Pulisce l'input del tag dopo l'aggiunta
    }
  };

  // Funzione per eliminare un tag dal post
  const handleTagDelete = (tagToDelete: string) => {
    if (newPostRef.current) {
      newPostRef.current.tags = newPostRef.current.tags.filter(tag => tag !== tagToDelete); // Rimuove il tag selezionato dall'array dei tag del post corrente
    }
  };

  // Funzione per gestire l'invio del form di creazione/modifica del post
  const handleFormSubmit = () => {
    if (newPostRef.current) {
      const updatedPost = { ...newPostRef.current };
      if (updatedPost.id) {
        // Se il post ha un ID, allora stiamo modificando un post esistente
        updatePost(updatedPost).then((data: Post) => {
          setPosts(prevPosts => prevPosts.map(post => (post.id === data.id ? data : post))); // Aggiorna il post nello stato con i nuovi dati
        });
      } else {
        // Se non c'è un ID, allora stiamo creando un nuovo post
        createPost(updatedPost).then((data: Post) => {
          setPosts(prevPosts => [...prevPosts, { ...data, id: posts.length + 1 }]); // Aggiunge il nuovo post all'array dei post
        });
      }
    }
    newPostRef.current = null; // Resetta il riferimento al post una volta inviato
    tagInputRef.current = ''; // Resetta l'input del tag una volta inviato
    setDialogOpen(false); // Chiude il dialog dopo l'invio del form
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
            // Crea un nuovo post vuoto e apre il dialog per aggiungerlo
            newPostRef.current = { id: 0, title: '', body: '', tags: [], views: Math.floor(Math.random() * 1000) };
            setDialogOpen(true);
          }}
        >
          Create
        </Button>
      </Toolbar>

      {/* Dialog per la creazione o modifica del post */}
      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{newPostRef.current?.id ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            defaultValue={newPostRef.current?.title || ''}
            onChange={handleInputChange} // Gestisce il cambiamento del campo titolo
          />
          <TextField
            margin="dense"
            label="Body"
            name="body"
            fullWidth
            defaultValue={newPostRef.current?.body || ''}
            onChange={handleInputChange} // Gestisce il cambiamento del campo body
          />
          <Stack direction="row" spacing={1} sx={{ marginTop: '10px' }}>
            <TextField margin="dense" label="Add Tag" defaultValue={tagInputRef.current} onChange={handleTagInputChange} />
            <Button onClick={handleAddTag} variant="contained" color="primary">
              Add Tag
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ marginTop: '10px' }}>
            {newPostRef.current?.tags.map((tag, index) => (
              <Chip key={index} label={tag} onDelete={() => handleTagDelete(tag)} /> // Mostra tutti i tag aggiunti e permette di eliminarli
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
                      <Chip key={index} label={tag} /> // Visualizza ogni tag associato al post
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
