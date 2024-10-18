import express from "express";
import usersController from "../controllers/users-controller.js";
import mata_kuliahController from "../controllers/mata_kuliah-controller.js";
import jadwal_kuliahController from "../controllers/jadwal_kuliah-controller.js";

const router = express.Router();
router.post("/users", usersController.create);
router.post("/users/login", usersController.login);
router.get("/mata_kuliah", mata_kuliahController.get);
router.get("/jadwal_kuliah", jadwal_kuliahController.get);
export default router;
