import { database_client } from "../../utils/database_utils";
import Log_Model from "../logs_component/logs_model";

const log_model = Log_Model.get_instance();

export type Borrowing_Type = {
    user_email: string,
    book_title: string,
    book_id: number,
    checkout_date: Date | null,
    due_date: Date | null
}

class Borrwing_Model{

    private static instance: Borrwing_Model;

    private constructor(){}

    public static get_instance(): Borrwing_Model{
        if(!Borrwing_Model.instance){
            Borrwing_Model.instance = new Borrwing_Model();
        }
        return Borrwing_Model.instance;
    }

    public create_borrow = async (borrowing: Borrowing_Type) => {
        
        const { user_email, book_id, book_title, checkout_date, due_date } = borrowing;

        const borrower = await database_client.borrower.findUnique({
            where: {
                email: user_email
            }
        });

        await database_client.borrowing.create({
            data: {
                borrowerId: borrower?.id || 0,
                bookId: book_id,
                checkoutDate: checkout_date || new Date(),
                returnDate: null,
                dueDate: due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        await log_model.create_log( borrower?.name || '' ,book_title, "borrow");

        return borrowing;

    }


    public return_book = async (borrowing: Borrowing_Type) => {
        
        const { user_email, book_id, book_title } = borrowing;
        const borrower = await database_client.borrower.findUnique({
            where: {
                email: user_email
            }
        });

        const borrowing_id = await database_client.borrowing.findFirst({
            where: {
                borrowerId: borrower?.id,
                bookId: book_id,
                returnDate: null,
            }
        });

        if(!borrowing_id){
            throw new Error("Borrowing not found");
        }

        const borrowing_update = await database_client.borrowing.update({
            where: {
                id: borrowing_id.id
            },
            data: {
                returnDate: new Date()
            }
        });
        await log_model.create_log( borrower?.name || '' ,book_title, "borrow");
        return borrowing_update;
    }
    
}

export default Borrwing_Model;
