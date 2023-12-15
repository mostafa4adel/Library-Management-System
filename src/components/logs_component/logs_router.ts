import express from 'express';
import { is_admin } from '../../utils/jwt_utils';
import Log_Model from './logs_model';

const logs_router = express.Router();
const logs_model = Log_Model.get_instance();

logs_router.use(is_admin);

logs_router.get('/get', (req,res) => {
    const { book_title, borrower_name, borrowed, returned, date_from, date_to } = req.body;
    const logs = logs_model.get_logs(book_title, borrower_name, borrowed, returned, date_from, date_to);
    res.status(200).json({
        message: "Logs fetched successfully",
        data: logs
    });
}
);

export default logs_router;