import { database_client } from "../../utils/database_utils";
import bcrypt from 'bcrypt';
import { DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_USERNAME } from "../../config";

class Admin_Model{
    
    private static _instance: Admin_Model;

    private constructor() {}

    public static get_instance() {
        if (!Admin_Model._instance) {
            Admin_Model._instance = new Admin_Model();
        }
        return Admin_Model._instance;
    }

    public async get_admin(username: string): Promise<{password: string, refresh_token: string} | null> {
        const admin = await database_client.admin.findFirst({
            where: {
                username: username
            }
        });
    
        if (admin) {
            return {
                password: admin.password,
                refresh_token: admin.refreshToken || ''
            };
        } else {
            return null;
        }
    }

    public async validate_admin(username: string, password: string) {
        const admin = await database_client.admin.findFirst({
            where: {
                username: username
            }
        });
        if (admin == null) {
            return false;
        }
        return await bcrypt.compare(password, admin.password);
    }

    public async generate_first_admin() {
        if (await database_client.admin.findFirst() != null) {
            return null;
        }
        console.log("Generating first admin");

        return await database_client.admin.create({
            data: {
                username: DEFAULT_ADMIN_USERNAME,                                          
                password: await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)                    
            }
        });
    }

    public async add_admin(admin_username:string,username: string, password: string)   {
        if (admin_username != DEFAULT_ADMIN_USERNAME) {                                    
            return null;
        }

        return await database_client.admin.create({
            data: {
                username: username,
                password: await bcrypt.hash(password, 10)
            }
        });
    }
    
    public async delete_admin(username_deleter: string,username_delete: string) {

        if (username_deleter != DEFAULT_ADMIN_USERNAME) {                                   
            return null;
        }

        return await database_client.admin.delete({
            where: {
                username: username_delete
            }
        });

        return null;
    }
    
    public async set_refresh_token(username: string, refresh_token: string) {
        await database_client.admin.update({
            where: {
                username: username
            },
            data: {
                refreshToken: refresh_token
            }
        });
    }

    public async get_refresh_token(username: string) {
        const admin = await database_client.admin.findFirst({
            where: {
                username: username
            }
        });
        if (admin == null) {
            return null;
        }
        return admin.refreshToken;
    }

    public async delete_refresh_token(username: string) {
        await database_client.admin.update({
            where: {
                username: username
            },
            data: {
                refreshToken: null
            }
        });
    }
}

export default Admin_Model;