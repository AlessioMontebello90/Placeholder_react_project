// Importazione di React e dei componenti MUI per costruire l'interfaccia utente
import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { Paper, Toolbar, TextField, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './PostsTable.css'; // Stile CSS personalizzato per la tabella dei post
import { fetchPosts, updatePost, createPost, deletePost } from './PostService'; // Funzioni di servizio per gestire i post
import { Post } from './PostTypes'; // Tipo definito per i post

export function PostsTable() {
  // Stato per mantenere l'elenco dei post e la visibilità del dialogo
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Uso di useRef per gestire il post attuale e l'input dei tag (senza innescare un re-render)
  const currentPostRef = useRef<Post>({ id: 0, title: '', body: '', tags: [], views: 0 });
  const tagInputRef = useRef<string>('');

  // useEffect per caricare i post una volta al montaggio del componente
  useEffect(() => {
    fetchPosts(10).then(data =>
      setPosts(data.map(post => ({
        ...post,
        tags: [], // Inizializzo i tag come array vuoto
        views: Math.floor(Math.random() * 1000), // Assegno un numero casuale di visualizzazioni
      })))
    );
  }, []);

  // Funzione per gestire l'apertura del dialogo di modifica, impostando i dati del post corrente
  const handleEdit = (post: Post) => {
    currentPostRef.current = { ...post }; // Clono i dati del post per poterli modificare senza alterare l'originale
    setDialogOpen(true); // Apro il dialogo
  };

  // Funzione per gestire l'eliminazione di un post specifico
  const handleDelete = async (postId: number) => {
    await deletePost(postId); // Chiamo il servizio per eliminare il post
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId)); // Aggiorno l'elenco dei post rimuovendo il post eliminato
  };

  // Gestione dell'input per i campi titolo e corpo del post
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    currentPostRef.current = { ...currentPostRef.current, [name]: value }; // Aggiorno solo il campo modificato
  };

  // Gestione dell'input per il campo "aggiungi tag"
  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    tagInputRef.current = event.target.value; // Aggiorno il ref del tag input
  };

  // Aggiungo un tag al post corrente
  const handleAddTag = () => {
    if (tagInputRef.current.trim()) { // Verifico che l'input non sia vuoto o solo spazi
      currentPostRef.current.tags = [...currentPostRef.current.tags, tagInputRef.current.trim()]; // Aggiungo il nuovo tag all'array
      tagInputRef.current = ''; // Resetto il campo di input tag
      setPosts([...posts]); // Triggero un re-render per visualizzare il tag aggiunto
    }
  };

  // Rimuovo un tag specifico dal post corrente
  const handleTagDelete = (tagToDelete: string) => {
    currentPostRef.current.tags = currentPostRef.current.tags.filter(tag => tag !== tagToDelete); // Filtra l'array per rimuovere il tag selezionato
    setPosts([...posts]); // Triggero un re-render per aggiornare la visualizzazione
  };

  // Gestione del submit per creare o aggiornare un post
  const handleFormSubmit = async () => {
    const postToSubmit = { ...currentPostRef.current };
    if (postToSubmit.id) {
      // Se esiste un ID, aggiorno il post
      const updatedPost = await updatePost(postToSubmit);
      setPosts(prevPosts => prevPosts.map(post => (post.id === updatedPost.id ? updatedPost : post))); // Aggiorno solo il post modificato nell'elenco
    } else {
      // Se non esiste un ID, creo un nuovo post
      const newPost = await createPost(postToSubmit);
      setPosts(prevPosts => [...prevPosts, { ...newPost, id: posts.length + 1 }]); // Aggiungo il nuovo post all'elenco
    }
    currentPostRef.current = { id: 0, title: '', body: '', tags: [], views: 0 }; // Reset del post corrente
    tagInputRef.current = ''; // Reset del campo tag
    setDialogOpen(false); // Chiudo il dialogo
  };

  return (
    <Paper className="PostsTable-container" sx={{ margin: '20px', padding: '20px' }}>
      <Toolbar>
        {/* Bottone per creare un nuovo post */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ marginLeft: '10px' }}
          onClick={() => {
            currentPostRef.current = { id: 0, title: '', body: '', tags: [], views: Math.floor(Math.random() * 1000) }; // Reset del post corrente
            setDialogOpen(true); // Apro il dialogo per creare un nuovo post
          }}
        >
          Create
        </Button>
      </Toolbar>

      {/* Dialogo per creare o modificare un post */}
      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{currentPostRef.current.id ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        <DialogContent>
          {/* Input per il titolo del post */}
          <TextField margin="dense" label="Title" name="title" fullWidth defaultValue={currentPostRef.current.title} onChange={handleInputChange} />
          {/* Input per il corpo del post */}
          <TextField margin="dense" label="Body" name="body" fullWidth defaultValue={currentPostRef.current.body} onChange={handleInputChange} />
          {/* Input per aggiungere tag */}
          <Stack direction="row" spacing={1} sx={{ marginTop: '10px' }}>
            <TextField margin="dense" label="Add Tag" defaultValue={tagInputRef.current} onChange={handleTagInputChange} />
            <Button onClick={handleAddTag} variant="contained" color="primary">Add Tag</Button>
          </Stack>
          {/* Visualizzo i tag aggiunti */}
          <Stack direction="row" spacing={1} sx={{ marginTop: '10px' }}>
            {currentPostRef.current.tags.map((tag, index) => (
              <Chip key={index} label={tag} onDelete={() => handleTagDelete(tag)} />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Tabella per visualizzare i post */}
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
                  <IconButton color="primary" onClick={() => handleEdit(post)}><EditIcon /></IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(post.id)}><DeleteIcon /></IconButton>
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
