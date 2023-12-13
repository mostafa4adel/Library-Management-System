import { Request,Response } from "express";
import { decode_token } from "./jwt_utils";

export const validate_token = (req: Request, res: Response, next: any) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    const id = decode_token(token);
    if (id == null) return res.sendStatus(403);

    req.body.id = id;
    next();
    
}




