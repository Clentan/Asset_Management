import { Request, Response, Router } from "express";
import { sendOpt, verifyOtp } from "../controllers/otp.controller";
import { supabase } from "../lib/supabase";
import {createUser, deleteUser} from "../controllers/users.controller";

const router = Router();

router.post("/api/otp/send", sendOpt);
router.post("/api/otp/verify", verifyOtp);
router.post('/api/users/create', createUser);
router.delete("/api/users/delete/:userId", deleteUser)

export default router 