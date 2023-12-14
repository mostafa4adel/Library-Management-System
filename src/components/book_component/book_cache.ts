import { Redis_Client } from "../../utils/redis_util";
import { database_client } from "../../utils/database_utils";

const redis_client = Redis_Client.get_client();

class Book_Cache {

    private static _instance: Book_Cache;

    private constructor() {}

    public static get_instance() {
        if (!Book_Cache._instance) {
            Book_Cache._instance = new Book_Cache();
        }
        return Book_Cache._instance;
    }

    public async get_book(id: number) {
        return JSON.parse(await redis_client.get(id.toString()));
    }

    public async set_book(id: number, title: string, author: string, ISBN: string, available_quantity: number, shelf_located: string) {
        const book = {
            title: title,
            shelf_located: shelf_located,
            author: author,
            ISBN: ISBN,
            available_quantity: available_quantity
        };
        await redis_client.set(id.toString(), JSON.stringify(book));
    }

    public async delete_book(id: number) {
        await redis_client.del(id.toString());
    }

    public async get_books(title?: string, author?: string, ISBN?: string, available_quantity?: number, shelf_located?: string, sortField?: keyof typeof database_client.book, sortOrder?: 'asc' | 'desc') {
        // simple caching for queries
        // store hash parameters if query is not cached
        // use hash parameters to generate key
        // if key exists, return cached result

        const key = this.generate_key(title, author, ISBN, available_quantity, shelf_located, sortField, sortOrder);
        const result = await redis_client.get(key);
        if (result) {
            return JSON.parse(result);
        } else {
            return null;
        }
    }


    public async set_books(title?: string, author?: string, ISBN?: string, available_quantity?: number, shelf_located?: string, sortField?: keyof typeof database_client.book, sortOrder?: 'asc' | 'desc', books?: any) {
        const key = this.generate_key(title, author, ISBN, available_quantity, shelf_located, sortField, sortOrder);
        await redis_client.set(key, JSON.stringify(books) );
    }

    private generate_key(title?: string, author?: string, ISBN?: string, available_quantity?: number, shelf_located?: string, sortField?: keyof typeof database_client.book, sortOrder?: 'asc' | 'desc'): string {
        const keyParts = [title, author, ISBN, available_quantity, shelf_located, sortField, sortOrder]
            .map(part => part ?? '*') // replace undefined with '*'
            .join(':'); // join parts with ':'
    
        return `books:${this.hashString(keyParts)}`;
    }

    private hashString(str: string): number {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
        }
        return hash;
    }
}


export default Book_Cache;