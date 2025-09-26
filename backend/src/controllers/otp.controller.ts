import { Request, Response } from "express";
import { generateOtp } from "../utils/otpGenerator";
import { supabase } from "../lib/supabase";
import { transporter } from "../utils/nodemailer";

export const sendOpt = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const code: string = generateOtp();
    const expirationTime = new Date(
      new Date().getTime() + 10 * 60000
    ).toISOString(); // 10 minutes from now

    const { data, error } = await supabase
      .from("email_otps")
      .upsert([
        {
          email,
          code,
          expires_at: expirationTime,
        },
      ])
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    const mailOptions = {
      from: "frankiemosehla@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${code}`,
    };

    transporter.sendMail(mailOptions, (error, _) => {
      if (error) {
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
      return res.status(200).json({ message: "OTP sent successfully", isSent: true });
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response
): Promise<void | any> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        email: !email ? "Email is required" : "",
        otp: !otp ? "otp is required" : "",
      });
    }

    const { error, data } = await supabase.from("email_otps")
    .select("*")
    .eq("email", email)
    .eq("code", otp)
    .gt("expires_at", new Date().toISOString())
    .single();

    if (error || !data) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await supabase
        .from("email_otps")
        .delete()
        .eq("email", email);

    return res.status(200).json({ 
        message: "OTP Verified successfully",
        isVerified: true
    });

  } catch (error: any) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error" })
  }
};
