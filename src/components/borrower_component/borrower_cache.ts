import { Redis_Client } from "../../utils/redis_util";
import bcrypt from 'bcrypt';

const redis_client = Redis_Client.get_client();

class Borrower_Cache{

    private static _instance: Borrower_Cache;
    private constructor(){}

    public static get_instance(){
        if(!Borrower_Cache._instance){
            Borrower_Cache._instance = new Borrower_Cache();
        }
        return Borrower_Cache._instance;
    }

    public async get_borrower(email: string){
        return JSON.parse(await redis_client.get(email));
    }

    public async delete_borrower(email: string){
        await redis_client.del(email);
    }

    public async set_borrower(email: string, password: string, refresh_token: string){
        const hashedPassword = await bcrypt.hash(password, 10);
        const borrower = {
            password: hashedPassword,
            refresh_token: refresh_token
        };
        await redis_client.set(email, JSON.stringify(borrower));
    }

}

export default Borrower_Cache;