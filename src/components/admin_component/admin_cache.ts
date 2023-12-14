import { Redis_Client } from "../../utils/redis_util";
import bcrypt from 'bcrypt';

const redis_client = Redis_Client.get_client();

class Admin_Cache {
    private static _instance: Admin_Cache;

    private constructor() {}

    public static get_instance() {
        if (!Admin_Cache._instance) {
            Admin_Cache._instance = new Admin_Cache();
        }
        return Admin_Cache._instance;
    }

    public async get_admin(username: string) {
        return await redis_client.get(username);
    }

    public async set_admin(username: string, password: string, refresh_token: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = {
            password: hashedPassword,
            refresh_token: refresh_token
        };
        await redis_client.set(username, JSON.stringify(admin));
    }

    public  async delete_admin(username: string) {
        await redis_client.del(username);
    }

}

export default Admin_Cache;