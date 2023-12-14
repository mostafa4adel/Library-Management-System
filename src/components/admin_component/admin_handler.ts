import Admin_Cache from "./admin_cache";
import Admin_Model from "./admin_model";
import { Request, Response } from "express";
import { generate_access_token, generate_refresh_token } from "../../utils/jwt_utils";
import bcrypt from 'bcrypt';

const admin_cache = Admin_Cache.get_instance();
const admin_model = Admin_Model.get_instance();

class Admin_Handler {
    private static _instance: Admin_Handler;

    private constructor() { }

    public static get_instance() {
        if (!Admin_Handler._instance) {
            Admin_Handler._instance = new Admin_Handler();
        }
        return Admin_Handler._instance;
    }

    public async login_admin(Request: Request, Response: Response) {
        const { username, password } = Request.body;

        try {
            let admin =  JSON.parse(await admin_cache.get_admin(username));

            console.log(admin);
            
            if (admin != null) {
                console.log("Admin found in cache");

                if (await bcrypt.compare(password, admin.password)) {
                    const refresh_token = generate_refresh_token(username, true);
                    const access_token = generate_access_token(username, true);
                    
                    admin_cache.set_admin(username, password, refresh_token || '');
                    admin_model.set_refresh_token(username, refresh_token || '');

                    return Response.status(200).json({ refresh_token: refresh_token, access_token: access_token });
                }
                return Response.status(401).json({ message: "Invalid password" });
            }

            const valid = await admin_model.validate_admin(username, password);
            if (valid) {
                const refresh_token = generate_refresh_token(username, true);
                const access_token = generate_access_token(username, true);

                admin_cache.set_admin(username, password, refresh_token || '');
                admin_model.set_refresh_token(username, refresh_token || '');

                return Response.status(200).json({
                    refresh_token: refresh_token,
                    access_token: access_token
                });
            }
            return Response.status(404).json({ message: "Admin not found" });
        } catch (error) {
            console.error(error);
            return Response.status(500).json({ message: "An error occurred while logging in" });
        }
    }

    public async logout_admin(Request: Request, Response: Response) {
        const  username  = Request.body.token_username;

        try {
            let admin = JSON.parse(await admin_cache.get_admin(username));
            if (admin != null) {
                admin_cache.delete_admin(username);
                admin_model.delete_refresh_token(username);
                return Response.status(200).json({ message: "Logged out successfully" });
            }

            admin = await admin_model.get_admin(username);
            if (admin != null) {
                admin_model.delete_refresh_token(username);
                return Response.status(200).json({ message: "Logged out successfully" });
            }

            return Response.status(404).json({ message: "Admin not found" });
        } catch (error) {
            console.error(error);
            return Response.status(500).json({ message: "An error occurred while logging out" });
        }
    }


    public async register_admin(Request: Request, Response: Response) {
        try {
            const username  = Request.body.token_username;
            const { new_username, new_password } = Request.body;

            const admin = await admin_model.get_admin(new_username);

            if (admin) {
                return Response.status(409).json({ message: "Admin already exists" });
            }

            if (await admin_model.add_admin(username, new_username, new_password)) {
                return Response.status(200).json({ message: "Admin registered successfully" });
            }
            else
            {
                // ONLY DEFAULT ADMIN CAN EDIT ADMINS
                return Response.status(401).json({ message: "Unauthorized" });
            }

        }
        catch (error) {
            console.error(error);
            return Response.status(500).json({ message: "An error occurred while registering admin" });
        }
    }

    public async delete_admin(Request: Request, Response: Response) {
        try {
            const username  = Request.body.token_username;
            const  del_username  = Request.body.del_username;

            const admin = await admin_model.get_admin(del_username);

            if (!admin) {
                return Response.status(404).json({ message: "Admin not found" });
            }

            const del_admin = await admin_model.delete_admin(username, del_username);

            if (del_admin)
            {
                return Response.status(200).json({ message: "Admin deleted successfully" });
            }
            else
            {
                // ONLY DEFAULT ADMIN CAN EDIT ADMINS
                return Response.status(401).json({ message: "Unauthorized" });
            }

            

        }
        catch (error) {
            console.error(error);
            return Response.status(500).json({ message: "An error occurred while deleting admin" });
        }
    }


    public async refresh_token(Request: Request, Response: Response) {
        const { username, refresh_token } = Request.body;
        
        try {
            let admin = JSON.parse(await admin_cache.get_admin(username));
            
            if (admin && admin.refresh_token === refresh_token) {
                return  await Admin_Handler.send_new_access_token(Response, username);
            }
    
            admin = await admin_model.get_admin(username);
            
            if (admin && admin.refresh_token === refresh_token) {
                admin_cache.update_admin(username, admin.password, refresh_token);
                return await Admin_Handler.send_new_access_token(Response, username);
            }
    
            // Revoke all tokens for the admin, token is compromised
            await admin_model.delete_refresh_token(username);
    
            return Response.status(401).json({ message: "Invalid refresh token" });
    
        } catch (error) {
            console.error(error);
            return Response.status(500).json({ message: "An error occurred while refreshing token" });
        }
    }
    
    private static async send_new_access_token(Response: Response, username: string) {
        try {
            const access_token = generate_access_token(username, true);
            return Response.status(200).json({ access_token: access_token });
        } catch (error) {
            console.error(error);
            return Response.status(500).json({ message: "An error occurred while generating access token" });
        }
    }

}

export default Admin_Handler;