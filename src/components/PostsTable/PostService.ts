// PostService.ts
// Importiamo il tipo `Post` definito nel file PostTypes, che descrive la struttura dei post
import { Post } from './PostTypes';

// Funzione per recuperare un elenco di post con un numero limitato di elementi
export async function fetchPosts(limit: number): Promise<Post[]> {
  // Facciamo una chiamata API GET per ottenere i post, aggiungendo un parametro per limitare i risultati
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`);
  // Restituiamo la risposta in formato JSON, che sarà un array di post
  return response.json();
}

// Funzione per aggiornare un post esistente
export async function updatePost(post: Post): Promise<Post> {
  // Eseguiamo una chiamata API PUT per aggiornare il post specifico tramite il suo `id`
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
    method: 'PUT', // Metodo PUT per sovrascrivere i dati del post esistente
    body: JSON.stringify(post), // Convertiamo il post in una stringa JSON per inviarlo come payload
    headers: {
      'Content-type': 'application/json; charset=UTF-8', // Impostiamo l'header Content-Type come JSON
    },
  });
  // Restituiamo la risposta in formato JSON, che rappresenta il post aggiornato
  return response.json();
}

// Funzione per creare un nuovo post
export async function createPost(post: Post): Promise<Post> {
  // Eseguiamo una chiamata API POST per creare un nuovo post
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST', // Metodo POST per creare una nuova risorsa
    body: JSON.stringify(post), // Convertiamo il nuovo post in JSON
    headers: {
      'Content-type': 'application/json; charset=UTF-8', // Specifichiamo il formato JSON per il payload
    },
  });
  // Restituiamo la risposta in formato JSON, che rappresenta il post creato
  return response.json();
}

// Funzione per eliminare un post esistente
export async function deletePost(postId: number): Promise<void> {
  // Eseguiamo una chiamata API DELETE per rimuovere il post specifico tramite il suo `id`
  await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
    method: 'DELETE', // Metodo DELETE per rimuovere la risorsa indicata
  });
  // Non restituiamo nulla, poiché DELETE generalmente non restituisce contenuto in risposta
}
