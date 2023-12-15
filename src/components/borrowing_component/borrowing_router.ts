import express from 'express';
import { is_borrower_middleware } from '../../utils/middleware_utils';
import Borrowing_Middleware from './borrowing_middleware';
import Borrowing_Handler from './borrowing_handler';


const borrowing_router = express.Router();
const borrowing_middleware = Borrowing_Middleware.get_instance();
const borrower_handler = Borrowing_Handler.get_instance();

borrowing_router.use(is_borrower_middleware , borrowing_middleware.add_user_email , borrowing_middleware.validate_borrow);

// borrow_book
borrowing_router.post('/borrow',  borrower_handler.borrow_book )

// return_book
borrowing_router.put('/return', borrower_handler.return_book )

export default borrowing_router;