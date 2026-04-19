import express from "express";
import upload from "../config/multer.js"
import {
getSpecialists,
createSpecialist,
updateSpecialist,
deleteSpecialist,
sendEmergencyEmail
} from "../controllers/specialistController.js";

const router = express.Router();

router.get("/",getSpecialists);

router.post("/",upload.single("image"),createSpecialist);

router.put("/:id",upload.single("image"),updateSpecialist);

router.delete("/:id",deleteSpecialist);

router.post("/emergency/:id",sendEmergencyEmail);

export default router;