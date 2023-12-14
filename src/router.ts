import { Router } from "express";
import book_router   from "./components/book_component/book_router";
import borrower_router   from "./components/borrower_component/borrower_router";
import  borrowing_router   from "./components/borrowing_component/borrowing_router";
import admin_router   from "./components/admin_component/admin_router";

const router = Router();

router.use('/book', book_router);
router.use('/borrower', borrower_router);
router.use('/borrowing', borrowing_router);
router.use('/admin', admin_router);

export default router;