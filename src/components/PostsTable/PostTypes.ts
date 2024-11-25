// PostTypes.ts

// Definiamo l'interfaccia `Post` per specificare la struttura di un post
export interface Post {
    // `id`: numero identificativo univoco del post
    id: number;
    
    // `title`: stringa che rappresenta il titolo del post
    title: string;
    
    // `body`: stringa che contiene il contenuto principale del post
    body: string;
    
    // `tags`: array di stringhe che rappresenta i tag associati al post
    tags: string[];
    
    // `views`: numero di visualizzazioni del post
    views: number;
}
