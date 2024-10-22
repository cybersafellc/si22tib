import express from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import mata_kuliahController from "../controllers/mata_kuliah-controller.js";
import jadwal_kuliahController from "../controllers/jadwal_kuliah-controller.js";
import tugasController from "../controllers/tugas-controller.js";
import kelompokController from "../controllers/kelompok-controller.js";
import usersController from "../controllers/users-controller.js";
import group_waControllers from "../controllers/group_wa-controllers.js";

const router = express.Router();
router.get("/users", authMiddleware.user, usersController.get);
router.post("/mata_kuliah", authMiddleware.user, mata_kuliahController.create);
router.post(
  "/jadwal_kuliah",
  authMiddleware.user,
  jadwal_kuliahController.create
);
router.post("/tugas", authMiddleware.user, tugasController.create);
router.delete("/tugas", authMiddleware.user, tugasController.deletes);
router.post("/kelompok", authMiddleware.user, kelompokController.create);
router.delete("/kelompok", authMiddleware.user, kelompokController.deletes);

router.get("/group_id", authMiddleware.user, group_waControllers.getGroupId);
router.post("/group_wa", authMiddleware.user, group_waControllers.create);
export default router;
