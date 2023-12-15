
import { Request, Response, NextFunction } from "express";
import { validate_access_token } from '../../utils/jwt_utils'

class Borrowing_Middleware {

    private static _instance: Borrowing_Middleware;

    private constructor() { }

    public static get_instance() {
        if (!Borrowing_Middleware._instance) {
            Borrowing_Middleware._instance = new Borrowing_Middleware();
        }
        return Borrowing_Middleware._instance;
    }

    public add_user_email = async (req: Request, res: Response, next: NextFunction) => {

        const auth_header = req.headers.authorization;
        const access_token = auth_header?.split(' ')[1];

        const user_email = validate_access_token(access_token || '', false);

        req.body.user_email = user_email;

        next();
    }

    public validate_borrow = async (req: Request, res: Response, next: NextFunction) => {
        {
            const book_id = req.body.book_id;

            if (!book_id) {
                res.status(400).send('Bad Request No Book ID');
            }

            next();
        }
    }

}

export default Borrowing_Middleware;