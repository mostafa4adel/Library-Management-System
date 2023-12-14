import Borrower_Cache from "./borrower_cache";
import Borrower_Model from "./borrower_model";
import { Request, Response } from "express";
import { generate_access_token, generate_refresh_token } from "../../utils/jwt_utils";
import bcrypt from 'bcrypt';

const borrower_cache = Borrower_Cache.get_instance();
const borrower_model = Borrower_Model.get_instance();

class Borrower_Handler {
    private static _instance: Borrower_Handler;

    private constructor() { }

    public static get_instance() {
        if (!Borrower_Handler._instance) {
            Borrower_Handler._instance = new Borrower_Handler();
        }
        return Borrower_Handler._instance;
    }


    public async register_borrower(req: Request, res: Response) {
        
        try{
            //check if borrower already exists with same email in cache then in db
            const borrower_ch = await borrower_cache.get_borrower(req.body.email);
            if(borrower_ch){
                return res.status(409).json({
                    message: "Borrower already exists"
                });
            }
            const borrower_db = await borrower_model.get_borrower(req.body.email);
            if(borrower_db){
                return res.status(409).json({
                    message: "Borrower already exists"
                });
            }

            const { name, email, password } = req.body;


            const borrower = await borrower_model.create_borrower(email, name, password);
            res.status(201).json({
                message: "Borrower created successfully",
                data: {
                    name: borrower.name,
                    email: borrower.email,
                    registeredDate: borrower.registeredDate
                }
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }

    }

    public async login_borrower(req: Request, res: Response) {
        try{
            const { email, password } = req.body;
            const borrower = await borrower_model.get_borrower(email);

            if(borrower != null  ){
                if (await bcrypt.compare(password, borrower.password)) {
                    const access_token = generate_access_token(email,false);
                    const refresh_token = generate_refresh_token(email,false);
                    await borrower_cache.set_borrower(email, password, refresh_token);
                    await borrower_model.set_refresh_token(email, refresh_token);
                    return res.status(200).json({
                        message: "Login successful",
                        data: {
                            access_token: access_token,
                            refresh_token: refresh_token
                        }
                    });
                }
                else{
                    return res.status(401).json({
                        message: "Invalid credentials"
                    });
                }
            }

            const is_valid = await borrower_model.validate_borrower(email, password);

            if(!is_valid){
                return res.status(401).json({
                    message: "Invalid credentials"
                });
            }

            const access_token = generate_access_token(email,false);
            const refresh_token = generate_refresh_token(email,false);
            await borrower_cache.set_borrower(email, password, refresh_token);
            await borrower_model.set_refresh_token(email, refresh_token);

            res.status(200).json({
                message: "Login successful",
                data: {
                    access_token: access_token,
                    refresh_token: refresh_token
                }
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }  

    public async logout_borrower(req: Request, res: Response) {
        try{
            const { email } = req.body;
            await borrower_cache.delete_borrower(email);
            await borrower_model.delete_refresh_token(email);
            res.status(200).json({
                message: "Logout successful"
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }

    public async edit_borrower(req: Request, res: Response) {
        try{
            const { name, email, password } = req.body;
            
            const borrower = await borrower_model.edit_borrower(name, email, password);
            
            const borrower_ch = await borrower_cache.get_borrower(email);
            if(borrower_ch){
                await borrower_cache.set_borrower(email, password, borrower_ch.refresh_token);
            }

            res.status(200).json({
                message: "Borrower updated successfully",
                data: {
                    name: borrower.name,
                    email: borrower.email,
                    registeredDate: borrower.registeredDate
                }
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }

    public async refresh_token(req: Request, res: Response) {
        try{
            const { email } = req.body;
            const borrower = await borrower_cache.get_borrower(email);

            if(borrower && borrower.refresh_token == req.body.refresh_token){
                return await  Borrower_Handler.send_new_access_token(res, email);          
            }

            const borrower_db = await borrower_model.get_borrower(email);
            if(borrower_db && borrower_db.refresh_token == req.body.refresh_token){
                borrower_cache.set_borrower(email, borrower_db.password, borrower_db.refresh_token);
                return await Borrower_Handler.send_new_access_token(res, email);
            }

            await borrower_model.delete_refresh_token(email);

            return res.status(401).json({
                message: "Invalid refresh token please login for new refresh token"
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }
    
    private static async send_new_access_token(Response: Response, email: string) {
        try{
            const access_token = generate_access_token(email,false);
            return Response.status(200).json({ access_token: access_token });
        }
        catch(err){
            console.log(err);
            Response.status(500).json({
                message: "Internal Server Error"
            });
        }
    }
}

export default Borrower_Handler;