import { database_client } from "../../utils/database_utils";

class Book_Model{
    private static _instance: Book_Model;


    private constructor() {}

    public static get_instance() {
        if (!Book_Model._instance) {
            Book_Model._instance = new Book_Model();
        }
        return Book_Model._instance;
    }

    public async get_book(id: number): Promise<any | null> {
        const book = await database_client.book.findFirst({
            where: {
                id: id
            }
        });
    
        if (book) {
            return book;
        } else {
            return null;
        }
    }

    public async get_books(title?: string, author?: string, ISBN?: string, available_quantity?: number, shelf_located?: string, sortField?: keyof typeof database_client.book, sortOrder?: 'asc' | 'desc'): Promise<any | null> {
        const whereClause: any = {};
    
        if (title) whereClause.title = title;
        if (author) whereClause.author = author;
        if (ISBN) whereClause.ISBN = ISBN;
        if (available_quantity) whereClause.availableQuantity = available_quantity;
        if (shelf_located) whereClause.shelfLocation = shelf_located;
    
        const orderByClause = sortField ? { [sortField]: sortOrder || 'asc' } : undefined;
    
        const books = await database_client.book.findMany({
            where: whereClause,
            orderBy: orderByClause
        });
    
        return books;
    }

    public async create_book(title: string, author: string, ISBN: string, available_quantity: number, shelf_located: string) {
        return await database_client.book.create({
            data: {
                title: title,
                author: author,
                ISBN: ISBN,
                availableQuantity: available_quantity,
                shelfLocation: shelf_located
            }
        });
    }

    public async update_book(id: number, title?: string, author?: string, ISBN?: string, available_quantity?: number, shelf_located?: string) {
        const data: any = {};
    
        if (title) data.title = title;
        if (author) data.author = author;
        if (ISBN) data.ISBN = ISBN;
        if (available_quantity) data.availableQuantity = available_quantity;
        if (shelf_located) data.shelfLocation = shelf_located;
    
        return await database_client.book.update({
            where: {
                id: id
            },
            data: data
        });
    }

    public async delete_book(id: number) {
        // check first if borrowed by anyone
        
        return await database_client.book.delete({
            where: {
                id: id
            }
        });
    }
}

export default Book_Model;