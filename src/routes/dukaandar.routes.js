import {
    getKhataByDate,
    getKhataByDukaandar,
    updateKhata
} from '../controllers/dukaandar.controller.js'
import { Router } from 'express'
const router = Router()

router.post('/getKhataByDate',getKhataByDate)
router.get('/getKhataByDukaandar/:dukaandarId',getKhataByDukaandar)
router.post('/updateKhata',updateKhata)

export default router;