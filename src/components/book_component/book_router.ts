import express from 'express';
import { is_admin_or_borrower_middleware, is_admin_middleware } from '../../utils/middleware_utils';
import Book_Handler from './book_handler';

const book_router = express.Router();
const book_handler = Book_Handler.get_instance();

// GET /book/search?title=...&author=...&ISBN=...&available_quantity=...&shelf_located=...  // for admins and users

book_router.get('/search', is_admin_or_borrower_middleware, book_handler.get_books );

// GET /book/:id // for admins and users

book_router.get('/:id', is_admin_or_borrower_middleware,  book_handler.get_book);

// POST /book for admins only

book_router.post('/', is_admin_middleware, book_handler.create_book );

// PUT /book/:id for admins only

book_router.put('/:id', is_admin_middleware, book_handler.update_book);

// DELETE /book/:id for admins only

book_router.delete('/:id', is_admin_middleware, book_handler.delete_book);


export default book_router;