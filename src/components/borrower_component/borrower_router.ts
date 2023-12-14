import express from 'express';
import { validate_borrower_register, validate_borrower_login, validate_borrower_edit, validate_borrower_token, validate_borrower_refresh_token } from './borrower_middleware';
import Borrower_Handler from './borrower_handler';

const borrower_router = express.Router();
const borrower_handler = Borrower_Handler.get_instance();


// REGISTER
borrower_router.post('/register', validate_borrower_register,borrower_handler.register_borrower );

// LOGIN
borrower_router.post('/login', validate_borrower_login,borrower_handler.login_borrower );

// REFRESH TOKEN
borrower_router.post('/refresh', validate_borrower_refresh_token, borrower_handler.refresh_token);

// validate token
borrower_router.use(validate_borrower_token);

// LOGOUT
borrower_router.post('/logout', borrower_handler.logout_borrower );

// EDIT PROFILE
borrower_router.post('/edit', validate_borrower_edit,borrower_handler.edit_borrower );

// DELETE OWN ACCOUNT
borrower_router.delete('/delete',  );


export default borrower_router;