import{
    addKhata,
    getKhata,
    getKhataByBepari
} from '../controllers/bepari.controller.js'

import { Router } from 'express'
const router = Router()

router.post('/addKhata',addKhata)
router.post('/getKhata',getKhata)
router.post('/getKhataByBepari',getKhataByBepari)

export default router


