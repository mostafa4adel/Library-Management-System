import Book_Cache from "./book_cache";
import Book_Model from "./book_model";
import { Request , Response } from "express";
import { database_client } from "../../utils/database_utils";

const book_cache = Book_Cache.get_instance();
const book_model = Book_Model.get_instance();


class Book_Handler{

    private static _instance: Book_Handler;
    
    private constructor() {}

    public static get_instance() {
        if (!Book_Handler._instance) {
            Book_Handler._instance = new Book_Handler();
        }
        return Book_Handler._instance;
    }

    public async get_book(Request:Request , Response:Response): Promise<any | null> {
        try {
            const id = parseInt(Request.params.id);
            
            const book = await book_cache.get_book(id);
        
            if (book) {
                return book;
            } else {
                const book = await book_model.get_book(id);
                if (book) {
                    await book_cache.set_book(book.id, book.title, book.author, book.ISBN, book.availableQuantity, book.shelfLocation);
                }
                return book;
            }
        } catch (err) {
            console.error('Error in get_book:', err);
            // handle the error, for example by returning a 400 response
            return Response.status(400).json({ message: "Invalid parameter" });
        }
    }

    public async get_books(Request:Request , Response:Response): Promise<any | null> {
        try{
            const title = Request.query.title?.toString();
            const author = Request.query.author?.toString();
            const ISBN = Request.query.ISBN?.toString();
            const available_quantity = Request.query.available_quantity ? parseInt(Request.query.available_quantity.toString()) : undefined;
            const shelf_located = Request.query.shelf_located?.toString();
            const sortField = Request.query.sortField?.toString() as keyof typeof database_client.book;
            const sortOrder = Request.query.sortOrder?.toString() as 'asc' | 'desc';
        
            const books = await book_cache.get_books(title, author, ISBN, available_quantity, shelf_located, sortField, sortOrder);
        
            if (books) {
                return books;
            } else {
                const books = await book_model.get_books(title, author, ISBN, available_quantity, shelf_located, sortField, sortOrder);
                if (books) {
                    await book_cache.set_books(title, author, ISBN, available_quantity, shelf_located, sortField, sortOrder, books);
                }
                return JSON.parse(books);
            }
        }   
        catch(err){
            console.error('Error in get_books:', err);
            // handle the error, for example by returning a 400 response
            return Response.status(400).json({ message: "Invalid parameter" });
        }
    }

    public async create_book(Request:Request , Response:Response) {
        try{
            const title = Request.body.title;
            const author = Request.body.author;
            const ISBN = Request.body.ISBN;
            const available_quantity = Request.body.available_quantity;
            const shelf_located = Request.body.shelf_located;
        
            const book = await book_model.create_book(title, author, ISBN, available_quantity, shelf_located);
        
            return book;
        }
        catch(err){
            console.error('Error in create_book:', err);
            // handle the error, for example by returning a 400 response
            return Response.status(400).json({ message: "Invalid parameter" });
        }
    }

    public async update_book(Request:Request , Response:Response) {
        try{
            const id = parseInt(Request.params.id);
            const title = Request.body.title;
            const author = Request.body.author;
            const ISBN = Request.body.ISBN;
            const available_quantity = Request.body.available_quantity;
            const shelf_located = Request.body.shelf_located;
        
            const book = await book_model.update_book(id, title, author, ISBN, available_quantity, shelf_located);
        
            return book;
        }
        catch(err){
            console.error('Error in update_book:', err);
            // handle the error, for example by returning a 400 response
            return Response.status(400).json({ message: "Invalid parameter" });
        }
    }

    public  async delete_book(Request:Request , Response:Response) {
        try{
            const id = parseInt(Request.params.id);
        
            const book = await book_model.delete_book(id);
        
            return book;
        }
        catch(err){
            console.error('Error in delete_book:', err);
            // handle the error, for example by returning a 400 response
            return Response.status(400).json({ message: "Invalid parameter" });
        }
    }
    
}

export default Book_Handler;