import express from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import mata_kuliahController from "../controllers/mata_kuliah-controller.js";
import jadwal_kuliahController from "../controllers/jadwal_kuliah-controller.js";

const router = express.Router();
router.post("/mata_kuliah", authMiddleware.user, mata_kuliahController.create);
router.post(
  "/jadwal_kuliah",
  authMiddleware.user,
  jadwal_kuliahController.create
);
export default router;