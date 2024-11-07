// PostsTable.tsx
import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { Paper, Toolbar, TextField, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './PostsTable.css';
import { fetchPosts, updatePost, createPost, deletePost } from './PostService';
import { Post } from './PostTypes';

export function PostsTable() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const newPostRef = useRef<Post | null>(null);
  const tagInputRef = useRef<string>('');

  useEffect(() => {
    fetchPosts(10).then((data: Post[]) =>
      setPosts(data.map((post: Post) => ({
        ...post,
        tags: [],
        views: Math.floor(Math.random() * 1000),
      })))
    );
  }, []);

  const handleEdit = (post: Post) => {
    newPostRef.current = { ...post };
    setDialogOpen(true);
  };

  const handleDelete = (postId: number) => {
    deletePost(postId).then(() => {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (newPostRef.current) {
      const fieldName = event.target.name as keyof Post;
      const value = event.target.value;

      if (typeof newPostRef.current[fieldName] === 'string') {
        newPostRef.current[fieldName] = value as never;
      }
    }
  };

  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    tagInputRef.current = event.target.value;
  };

  const handleAddTag = () => {
    if (tagInputRef.current.trim() && newPostRef.current) {
      newPostRef.current.tags = [...newPostRef.current.tags, tagInputRef.current.trim()];
      tagInputRef.current = '';
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    if (newPostRef.current) {
      newPostRef.current.tags = newPostRef.current.tags.filter(tag => tag !== tagToDelete);
    }
  };

  const handleFormSubmit = () => {
    if (newPostRef.current) {
      const updatedPost = { ...newPostRef.current };
      if (updatedPost.id) {
        updatePost(updatedPost).then((data: Post) => {
          setPosts(prevPosts => prevPosts.map(post => (post.id === data.id ? data : post)));
        });
      } else {
        const newId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
        createPost(updatedPost).then((data: Post) => {
          setPosts(prevPosts => [...prevPosts, { ...data, id: newId }]);
        });
      }
    }
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
