import express from "express";
import usersController from "../controllers/users-controller.js";
import mata_kuliahController from "../controllers/mata_kuliah-controller.js";
import jadwal_kuliahController from "../controllers/jadwal_kuliah-controller.js";
import tugasController from "../controllers/tugas-controller.js";
import kelompokController from "../controllers/kelompok-controller.js";
import group_waControllers from "../controllers/group_wa-controllers.js";

const router = express.Router();
router.post("/users", usersController.create);
router.post("/users/login", usersController.login);
router.get("/mata_kuliah", mata_kuliahController.get);
router.get("/jadwal_kuliah", jadwal_kuliahController.get);
router.get("/tugas", tugasController.get);
router.get("/kelompok", kelompokController.get);
router.get("/group-wa", group_waControllers.get);
export default router;
