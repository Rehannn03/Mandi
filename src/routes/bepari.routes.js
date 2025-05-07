import {
  addKhata,
  getKhata,
  getKhataByBepari,
  getKhataDates,
  getAkdaWithBepari,
  getAkdaDates,
  getAkda,
  updateAkda,
} from "../controllers/bepari.controller.js";

import { Router } from "express";
const router = Router();

router.post("/addKhata", addKhata);
router.get("/getKhata/:bepariId", getKhata);
router.get("/getKhataByBepari/:bepariId", getKhataByBepari);
router.get("/getKhataDates/:bepariId", getKhataDates);
router.get("/getAkdaBepari", getAkdaWithBepari);
router.get("/getAkdaDates/:bepariId", getAkdaDates);
router.get("/getAkda/:bepariId/:date", getAkda);
router.put("/updateAkda", updateAkda);
export default router;
