import { Request, Response } from "express";
import joi from "joi";
import { validate_access_token , validate_refresh_token } from '../../utils/jwt_utils'


const borrower_schema = joi.object({
    name: joi.string().min(3).max(10).required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).max(10).required()
});

const borrower_login_schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).max(10).required()
});

const borrower_edit_schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    password: joi.string().min(3).max(10).required(),
    new_password: joi.string().min(3).max(10).required()
});

export const validate_borrower_register = (req: Request, res: Response, next: Function) => {
    const { error } = borrower_schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

export const validate_borrower_login = (req: Request, res: Response, next: Function) => {
    const { error } = borrower_login_schema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}

export const validate_borrower_edit = (req: Request, res: Response, next: Function) => {
    const { error } = borrower_edit_schema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}


export const validate_borrower_token = (req: Request, res: Response, next: Function) => {
    
    const token = req.headers.authorization?.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ message: "No token provided" });
    }
    const email = validate_access_token(token, false);
    if (email == null) {
        return res.status(401).json({ message: "Invalid or Expired token" });
    }
    req.body.email = email;
    next();
}

export const validate_borrower_refresh_token = (req: Request, res: Response, next: Function) => {
    const { refresh_token } = req.body;

    if (refresh_token == null) {
        return res.status(401).json({ message: "No token provided" });
    }
    const email = validate_refresh_token(refresh_token, false);
    if (email == null) {
        return res.status(401).json({ message: "Invalid or Expired token" });
    }
    req.body.email = email;
    next();
}
