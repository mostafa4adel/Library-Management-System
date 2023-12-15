
import { database_client } from "../../utils/database_utils";
import { EventType } from '@prisma/client';

class Log_Model {
    private static _instance: Log_Model;

    private constructor() { }

    public static get_instance() {
        if (!Log_Model._instance) {
            Log_Model._instance = new Log_Model();
        }
        return Log_Model._instance;
    }

    public create_log = async (borrower_name: string, book_title: string, action: EventType) => {
        await database_client.log.create({
            data: {
                borrowerName: borrower_name,
                bookTitle: book_title,
                eventType: action
            }
        });
    }

    public get_logs = async (book_title:string , borrower_name:string, borrowed:boolean , returned:boolean, date_from: Date , date_to: Date ) => {
        // Determine the event type based on the borrowed and returned flags
        let eventType: EventType | null = null;
        if (borrowed) {
            eventType = EventType.borrow;
        } else if (returned) {
            eventType = EventType.return;
        }
    
        // Prepare the where object
        let whereObject: any = {
            bookTitle: book_title,
            borrowerName: borrower_name,
        };
    
        // Add eventType to the where object if it's not null
        if (eventType !== null) {
            whereObject.eventType = eventType;
        }

        if (date_from !== null && date_to !== null) {
            whereObject.createdAt = {
                gte: date_from,
                lte: date_to
            };
        }
    
        // Query the logs
        const logs = await database_client.log.findMany({
            where: whereObject
        });
    
        return logs;
    }

}   


export default Log_Model;