import{
    addKhata,
    getKhata,
    getKhataByBepari
} from '../controllers/bepari.controller.js'

import { Router } from 'express'
const router = Router()

router.post('/addKhata',addKhata)
router.get('/getKhata/:bepariId',getKhata)
router.get('/getKhataByBepari/:bepariId',getKhataByBepari)

export default router


