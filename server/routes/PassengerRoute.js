import express from "express";
// import { passengerProfileUpload } from "../middleware/Multer.js";
// import { passengerProfileUpload } from "../middleware/Upload.js";
import {
  PassengerLogin,
  PassengerRegister,
  GetPassengerProfile,
  UpdatePassengerProfile,
} from "../controllers/index.js";

import { requireAuth } from "../middleware/authMiddleware.js";
import multer from "multer";

import { Authenticate } from "../middleware/Auth.js";
const router = express.Router();
//router.use(Authenticate);
// const upload = multer();
// This route requires authentication, so only logged-in users can access it
router.patch("/update", UpdatePassengerProfile);

router.post("/register", PassengerRegister);
router.post("/login", PassengerLogin);


router.get("/", GetPassengerProfile);
// router.patch("/", passengerProfileUpload, UpdatePassengerProfile);

export { router as PassengerRoute };
