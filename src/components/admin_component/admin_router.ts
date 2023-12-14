import express from 'express';

import Admin_Handler from './admin_handler';
import Admin_Middleware from './admin_middleware';

const admin_router = express.Router();
const admin_handler = Admin_Handler.get_instance();
const admin_middleware = Admin_Middleware.get_instance();


admin_router.post('/login', admin_middleware.validate_admin_data, admin_handler.login_admin);

admin_router.get('/refresh',admin_middleware.validate_refresh_token , admin_handler.refresh_token );

admin_router.use(admin_middleware.validate_admin_token);

admin_router.post('/logout', admin_handler.logout_admin);

admin_router.post('/register', admin_middleware.validate_admin_data, admin_handler.register_admin );

admin_router.delete('/delete', admin_middleware.validate_admin_data, admin_handler.delete_admin);

export default admin_router;