import {Request,Response} from "express";
import { is_admin, is_borrower } from "./jwt_utils";

export const is_admin_middleware = (req: Request, res: Response, next: any) => {
    const auth_header = req.headers.authorization;
    const token = auth_header?.split(' ')[1];
    if (token && is_admin(token)) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

export const is_borrower_middleware = (req: Request, res: Response, next: any) => {
    const auth_header = req.headers.authorization;
    const token = auth_header?.split(' ')[1];
    if (token && is_borrower(token)) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}