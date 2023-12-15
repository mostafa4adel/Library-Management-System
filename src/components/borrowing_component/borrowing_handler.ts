
import Borrwing_Model from "./borrowing_model";
import { Request, Response } from "express";

import Book_Model from "../book_component/book_model";
import Book_Cache from "../book_component/book_cache";


const book_model = Book_Model.get_instance();
const borrowing_model = Borrwing_Model.get_instance();
const book_cache = Book_Cache.get_instance();

class Borrowing_Handler {

    private static _instance: Borrowing_Handler;

    private constructor() { }

    public static get_instance() {
        if (!Borrowing_Handler._instance) {
            Borrowing_Handler._instance = new Borrowing_Handler();
        }
        return Borrowing_Handler._instance;
    }

    public borrow_book = async (req: Request, res: Response) => {

        const { user_email, book_id } = req.body;

        const book_ch = await book_cache.get_book(book_id);

        if (book_ch) {
            if (book_ch.borrowed == 0) {
                return res.status(409).json({
                    message: "Book Not Available"
                });
            }
            else {

                await book_cache.set_book(book_ch.id, book_ch.title, book_ch.author, book_ch.ISBN, book_ch.availableQuantity - 1, book_ch.shelfLocation);
                await book_model.update_book(book_ch.id, book_ch.title, book_ch.author, book_ch.ISBN, book_ch.availableQuantity - 1, book_ch.shelfLocation);

                const borrowing = await borrowing_model.create_borrow(req.body);

                res.status(201).json({
                    message: "Book Borrowed Successfully",
                    data: {
                        user_email: borrowing.user_email,
                        book_id: borrowing.book_id,
                        checkout_date: borrowing.checkout_date,
                        due_date: borrowing.due_date
                    }
                });
            }


        }
        else {
            const book = await book_model.get_book(book_id);

            if (!book) {
                return res.status(404).json({
                    message: "Book Not Found"
                });
            }


            if (book.availableQuantity == 0) {
                await book_cache.set_book(book.id, book.title, book.author, book.ISBN, book.availableQuantity, book.shelfLocation);
                return res.status(409).json({
                    message: "Book Not Available"
                });
            }
            else {
                await book_cache.set_book(book.id, book.title, book.author, book.ISBN, book.availableQuantity - 1, book.shelfLocation);
                await book_model.update_book(book.id, book.title, book.author, book.ISBN, book.availableQuantity - 1, book.shelfLocation);

                const borrowing = await borrowing_model.create_borrow(
                    {
                        user_email: user_email,
                        book_id: book_id,
                        book_title: book.title,
                        checkout_date: new Date(),
                        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                    }
                );
                res.status(201).json({
                    message: "Book Borrowed Successfully",
                    data: {
                        user_email: borrowing.user_email,
                        book_id: borrowing.book_id,
                        checkout_date: borrowing.checkout_date,
                        due_date: borrowing.due_date
                    }
                });

            }
        }

    }

    public return_book = async (req: Request, res: Response) => {
        try {
            const { user_email, book_id } = req.body;
            const book_ch = await book_cache.get_book(book_id);


            if (book_ch) {
                await book_cache.set_book(book_ch.id, book_ch.title, book_ch.author, book_ch.ISBN, book_ch.availableQuantity + 1, book_ch.shelfLocation);
                await book_model.update_book(book_ch.id, book_ch.title, book_ch.author, book_ch.ISBN, book_ch.availableQuantity + 1, book_ch.shelfLocation);
                await borrowing_model.return_book({
                    user_email: user_email,
                    book_id: book_id,
                    book_title: book_ch.title,
                    checkout_date: null,
                    due_date: null
                });
                return res.status(200).json({
                    message: "Book Returned Successfully"
                });
            }
            else {
                const book = await book_model.get_book(book_id);
                await book_cache.set_book(book.id, book.title, book.author, book.ISBN, book.availableQuantity + 1, book.shelfLocation);
                await book_model.update_book(book.id, book.title, book.author, book.ISBN, book.availableQuantity + 1, book.shelfLocation);
                
                await borrowing_model.return_book({
                    user_email: user_email,
                    book_id: book_id,
                    book_title: book.title,
                    checkout_date: null,
                    due_date: null
                });
                return res.status(200).json({
                    message: "Book Returned Successfully"
                });
            }
        }
        catch (err) {
            return res.status(404).json({
                message: "Book Not Found or Not Borrowed"
            });
        }


    }


}

export default Borrowing_Handler;