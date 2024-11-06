import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { Paper, Toolbar, TextField, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

// TUTTE LE CHIMATE DI SERVIZIO DEVONO ESSERE GESTITE SCRIVI UN FILE POST SERVICE CON TUTTE LE CHIAMATE - DEVE PRENDERE TUTTO IL FETCH

export function PostsTable() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const newPostRef = useRef<Post | null>(null);
  const tagInputRef = useRef<string>('');

  // Effetto per caricare i post all'avvio del componente (simulazione di una chiamata API)
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
      .then(response => response.json())
      .then(data =>
        setPosts(data.map((post: any) => ({
          ...post,
          tags: [],
          views: Math.floor(Math.random() * 1000),
        })))
      );
  }, []);

  // Funzione per gestire la modifica di un post
  const handleEdit = (post: Post) => {
    newPostRef.current = { ...post };
    setDialogOpen(true);
  };

  // Funzione per gestire l'eliminazione di un post
  const handleDelete = (postId: number) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'DELETE',
    }).then(() => {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    });
  };

  // Funzione per gestire il cambiamento degli input del form di creazione/modifica
  // DEVE FUNNZIONARE LO STESSO ASKEYOFF
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (newPostRef.current) {
      const fieldName = event.target.name as keyof Post;
      const value = event.target.value;

      // Controlla il tipo della proprietà in `newPostRef.current`
      if (typeof newPostRef.current[fieldName] === 'string') {
        (newPostRef.current[fieldName] as string) = value;
      }
    }
  };

  // ----------------------------------------------------------------------------------

  // Funzione per gestire il cambiamento dell'input per i tag
  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    tagInputRef.current = event.target.value;
  };

  // Funzione per aggiungere un nuovo tag al post
  const handleAddTag = () => {
    if (tagInputRef.current.trim() && newPostRef.current) {
      newPostRef.current.tags = [...newPostRef.current.tags, tagInputRef.current.trim()];
      tagInputRef.current = '';
    }
  };

  // Funzione per eliminare un tag dal post
  const handleTagDelete = (tagToDelete: string) => {
    if (newPostRef.current) {
      newPostRef.current.tags = newPostRef.current.tags.filter(tag => tag !== tagToDelete);
    }
  };

  // Funzione per gestire l'invio del form di creazione/modifica del post

  // DA OTTIMIZZARE

  const handleFormSubmit = () => {
    if (newPostRef.current) {
      const updatedPost = { ...newPostRef.current };
      if (updatedPost.id) {
        fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedPost),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then((data: Post) => {
            setPosts(prevPosts => prevPosts.map(post => (post.id === data.id ? data : post)));
          });
      } else {
        fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          body: JSON.stringify(updatedPost),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then((data: Post) => {
            setPosts(prevPosts => [...prevPosts, { ...data, id: posts.length + 1 }]);
          });
      }
    }
    newPostRef.current = null;
    tagInputRef.current = '';
    setDialogOpen(false);
  };

  // -------------------------------------------------

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
            setDialogOpen(true);
          }}
        >
          Create
        </Button>
      </Toolbar>

      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{newPostRef.current?.id ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            defaultValue={newPostRef.current?.title || ''}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Body"
            name="body"
            fullWidth
            defaultValue={newPostRef.current?.body || ''}
            onChange={handleInputChange}
          />
          <Stack direction="row" spacing={1} sx={{ marginTop: '10px' }}>
            <TextField margin="dense" label="Add Tag" defaultValue={tagInputRef.current} onChange={handleTagInputChange} />
            <Button onClick={handleAddTag} variant="contained" color="primary">
              Add Tag
            </Button>
          </Stack>
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
