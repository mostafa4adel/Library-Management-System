import { database_client } from "../../utils/database_utils";
import bcrypt from 'bcrypt';

class Borrower_Model {


    private static _instance: Borrower_Model;

    private constructor() { }

    public static get_instance() {
        if (!Borrower_Model._instance) {
            Borrower_Model._instance = new Borrower_Model();
        }
        return Borrower_Model._instance;
    }


    public async get_all_borrowers() {

        return await database_client.borrower.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                registeredDate: true
            }
        });
    }

    public async get_borrower(email: string): Promise<{ borrower_id:number,password: string, refresh_token: string } | null> {
        
        const borrower = await database_client.borrower.findUnique({
            where: {
                email: email
            }
        });

        if (borrower) {
            return {
                borrower_id: borrower.id,
                password: borrower.password,
                refresh_token: borrower.refreshToken || ''
            };
        } else {
            return null;
        }
    }

    public async validate_borrower(email: string, password: string) {
        const borrower = await database_client.borrower.findUnique({
            where: {
                email: email
            }
        });
        
        if (borrower == null) {
            return false;
        }
        return await bcrypt.compare(password, borrower.password);
    }


    public async create_borrower(email: string, name: string, password: string) {
        return await database_client.borrower.create({
            data: {
                name: name,
                email: email,
                password: await bcrypt.hash(password, 10),
                registeredDate: new Date()
            }
        });
    }

    public async get_borrower_by_id(id: number) {
        return await database_client.borrower.findUnique({
            where: {
                id: id
            }
        });
    }

    public async edit_borrower(name: string, email: string, password: string) {
        return await database_client.borrower.update({
            where: {
                email: email
            },
            data: {
                name: name,
                password: await bcrypt.hash(password, 10)
            }
        });
    }

    public async delete_refresh_token(email: string) {
        await database_client.borrower.update({
            where: {
                email: email
            },
            data: {
                refreshToken: null
            }
        });
    }

    public async set_refresh_token(email: string, refresh_token: string) {
        await database_client.borrower.update({
            where: {
                email: email
            },
            data: {
                refreshToken: refresh_token
            }
        });
    }

    
    public async delete_borrower(email: string) {

        // check if he has any borrowed books
        // if he does, return null
        // if he dose not delete him

    }

}

export default Borrower_Model;