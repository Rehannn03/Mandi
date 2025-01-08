import {
    addInflow , addOutflow , getLedgers , getLedger,getLedgersDate
} from '../controllers/ledger.controller.js';
import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/addInflow',verifyJWT,addInflow);
router.post('/addOutflow',verifyJWT,addOutflow);
router.get('/getLedgers',verifyJWT,getLedgers);
router.get('/getLedger/:date',verifyJWT,getLedger);
router.get('/getLedgersDate',verifyJWT,getLedgersDate);
export default router;