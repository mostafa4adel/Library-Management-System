import express from 'express';


const book_router = express.Router();


// GET /book/search?title=...&author=...&ISBN=...&available_quantity=...&shelf_located=...  // for admins and users

book_router.get('/search', (req, res) => {
    res.send('searching for a book');
});

// GET /book/:id // for admins and users

book_router.get('/:id', (req, res) => {
    res.send('getting a book');
});

// POST /book for admins only

book_router.post('/', (req, res) => {
    res.send('creating a book');
});

// PUT /book/:id for admins only

book_router.post('/:id', (req, res) => {
    res.send('updating a book');
});

// DELETE /book/:id for admins only

book_router.delete('/:id', (req, res) => {
    res.send('deleting a book');
});


export default book_router;