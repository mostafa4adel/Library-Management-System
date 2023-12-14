
import { Request, Response, NextFunction } from 'express';
import { validate_access_token , validate_refresh_token } from '../../utils/jwt_utils'

import Joi from 'joi';

class Admin_Middleware {

    private static _instance: Admin_Middleware;
    private constructor() { }
    public static get_instance() {
        if (!Admin_Middleware._instance) {
            Admin_Middleware._instance = new Admin_Middleware();
        }
        return Admin_Middleware._instance;
    }


    private static admin_schema = Joi.object({
        username: Joi.string().min(3).max(10).required(),
        password: Joi.string().min(3).max(10).required()
    });

    public validate_admin_token = async (req: Request, res: Response, next: NextFunction) => {
        
        const token = req.headers.authorization?.split(' ')[1];
        if (token == null) {
            return res.status(401).json({ message: "No token provided" });
        }
        const username = validate_access_token(token, true);
        if (username == null) {
            return res.status(401).json({ message: "Invalid or Expired token" });
        }
        req.body.token_username = username;
        next();
    }

    public validate_admin_data = async (req: Request, res: Response, next: NextFunction) => {
        let { username, password } = req.body;

        if ( req.path == '/register') {
            password = '12345'
        }
        

        const { error } = Admin_Middleware.admin_schema.validate({ username, password });
        if ( req.path == '/register') {
            req.body.new_username = username;
            req.body.new_password = password;    
        }
        else if ( req.path == '/delete') {
            req.body.del_username = username;
        }
        
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        next();
    }

    public validate_refresh_token = async (req: Request, res: Response, next: NextFunction) => {
        const { refresh_token } = req.body;

        const username = validate_refresh_token(refresh_token, true);
        req.body.username = username;
        if (username == undefined) {
            return res.status(401).json({ message: "Invalid or Expired token Login for new Token" });
        }

        next();
    }

}

export default Admin_Middleware;