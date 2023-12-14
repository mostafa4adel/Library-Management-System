import {Request,Response} from "express";
import { is_admin, is_borrower } from "./jwt_utils";


const extractToken = (req: Request) => {
    const auth_header = req.headers.authorization;
    return auth_header?.split(' ')[1];
}

const handleAuth = (req: Request, res: Response, next: any, checkFn: (token: string) => boolean) => {
    const token = extractToken(req);
    if (token && checkFn(token)) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

export const is_admin_or_borrower_middleware = (req: Request, res: Response, next: any) => {
    handleAuth(req, res, next, token => is_admin(token) || is_borrower(token));
}

export const is_admin_middleware = (req: Request, res: Response, next: any) => {
    handleAuth(req, res, next, is_admin);
}

export const is_borrower_middleware = (req: Request, res: Response, next: any) => {
    handleAuth(req, res, next, is_borrower);
}