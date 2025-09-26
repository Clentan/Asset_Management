import { Request, Response, Router } from "express";
import { sendOpt, verifyOtp } from "../controllers/otp.controller";
import { supabase } from "../lib/supabase";

const router = Router();

router.post("/api/otp/send", sendOpt);
router.post("/api/otp/verify", verifyOtp);

router.post('/api/create-user', async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
  
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, 
        user_metadata: { role: 'user' } 
      });
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      res.status(200).json({ message: 'User created successfully', data });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

export default router 