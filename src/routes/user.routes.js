import {
  addUser,
  loginUser,
  logoutUser,
  addDukaandar,
  viewDukaandars,
  viewDukaandarById,
  addBepari,
  viewBeparis,
  viewBepariById,
  pattiGeneration,
  totalAkdas,
  totalSettled,
  totalUnsettled,
} from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/addUser", addUser);
router.post("/login", loginUser);
router.get("/logout", verifyJWT, logoutUser);
router.post("/addDukaandar", verifyJWT, addDukaandar);
router.get("/viewDukaandars", verifyJWT, viewDukaandars);
router.post("/viewDukaandarById", verifyJWT, viewDukaandarById);
router.post("/addBepari", verifyJWT, addBepari);
router.get("/viewBeparis", verifyJWT, viewBeparis);
router.post("/viewBepariById", verifyJWT, viewBepariById);
router.get("/pattiGeneration", pattiGeneration);
router.get("/totalAkdas", verifyJWT, totalAkdas);
router.get("/totalSettled", verifyJWT, totalSettled);
router.get("/totalUnsettled", verifyJWT, totalUnsettled);
export default router;
