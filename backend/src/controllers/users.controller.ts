import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { User } from "../interfaces/interfaces";
import { transporter } from "../utils/nodemailer";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { first_name, last_name, email, phone, password, role }: User = req.body;

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.log(error)
      return res.status(400).json({ error: error.message });
    }

    if (role === "super-admin" || role === "admin") {
      const { error: adminError } = await supabase.from("admins").upsert({
        adminId: data.user.id,
        first_name,
        last_name,
        email,
        role,
        phone,
        profile_picture: "",
        last_login: null, // Set to null instead of an empty string
      });
      if (adminError) {
        return res.status(400).json({ error: adminError.message });
      }
    }

    const mailOptions = {
      from: "frankiemosehla@gmail.com",
      to: email,
      subject: "Your Account Credentials",
      html: `
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Poppins', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        
        .email-header {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
          padding: 30px 20px;
          text-align: center;
        }
        
        .logo {
          max-width: 150px;
          margin-bottom: 15px;
        }
        
        .welcome-text {
          color: white;
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }
        
        .email-body {
          padding: 40px 30px;
        }
        
        .greeting {
          font-size: 20px;
          font-weight: 500;
          margin-top: 0;
          color: #4F46E5;
        }
        
        .message {
          margin-bottom: 25px;
          font-size: 16px;
        }
        
        .credentials-box {
          background-color: #F3F4F6;
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 25px;
        }
        
        .credentials-title {
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 15px;
          color: #4B5563;
        }
        
        .credentials-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        
        .credentials-item {
          padding: 10px 0;
          border-bottom: 1px solid #E5E7EB;
        }
        
        .credentials-item:last-child {
          border-bottom: none;
        }
        
        .label {
          font-weight: 500;
          color: #6B7280;
          display: inline-block;
          width: 80px;
        }
        
        .value {
          font-weight: 500;
          color: #111827;
        }
        
        .cta-button {
          display: block;
          text-align: center;
          background-color: #4F46E5;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 500;
          margin: 30px 0;
          transition: background-color 0.3s ease;
        }
        
        .security-note {
          background-color: #FFFBEB;
          border-left: 4px solid #F59E0B;
          padding: 15px;
          margin-bottom: 25px;
          font-size: 14px;
          color: #92400E;
        }
        
        .email-footer {
          background-color: #F9FAFB;
          padding: 20px 30px;
          text-align: center;
          color: #6B7280;
          font-size: 14px;
          border-top: 1px solid #E5E7EB;
        }
        
        .social-links {
          margin: 15px 0;
        }
        
        .social-link {
          display: inline-block;
          margin: 0 8px;
          color: #6B7280;
          text-decoration: none;
        }
        
        .footer-text {
          margin: 5px 0;
        }
        
        @media only screen and (max-width: 600px) {
          .email-body {
            padding: 30px 20px;
          }
          
          .email-header {
            padding: 20px 15px;
          }
        }
      </style>
        <div class="email-wrapper">
        <div class="email-header">
          <img src="https://lcx.co.za/wp-content/uploads/2024/12/thumbnail.png" alt="LCX Logo"  class="logo">
        </div>
        
        <div class="email-body">
          <h2 class="greeting">Hello ${first_name},</h2>
          
          <p class="message">You are added as member on our Asset System Below are your login credentials:</p>
          
          <div class="credentials-box">
            <h3 class="credentials-title">Your Login Information</h3>
            <ul class="credentials-list">
              <li class="credentials-item">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
              </li>
              <li class="credentials-item">
                <span class="label">Password:</span>
                <span class="value">${password}</span>
              </li>
            </ul>
          </div>
          
          <div class="security-note">
            <strong>Security Notice:</strong> Please change your password immediately after your first login and keep your credentials secure.
          </div>
          
          
          
          <p class="message">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        </div>
        
        <div class="email-footer">
          <div class="social-links">
            <a href="#" class="social-link">Twitter</a> • 
            <a href="#" class="social-link">Facebook</a> • 
            <a href="#" class="social-link">Instagram</a> • 
            <a href="#" class="social-link">LinkedIn</a>
          </div>
          
          <p class="footer-text">© ${new Date().getFullYear()} Limpopo connexion. All rights reserved.</p>
          <p class="footer-text">51 Biccard Street, Polokwane, South Africa</p>
        </div>
      </div>
      `
    };

    transporter.sendMail(mailOptions, (error, _) => {
      if (error) {
        return res.status(500).json({ error: "Failed to send info to the user" });
      }
      return res
        .status(200)
        .json({ message: "User created successfully", isSent: true });
    });

    res.status(200).json({ message: "User created successfully" });

  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const { userId } = req.params;
    if(!userId) {
      return res.status(400).json({ error: "user id is required" })
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if(error) {
      return res.status(500).json({ error: "An unknown error occurred while deleting user " })
    }

    return res.status(200).json({ message: "user deleted successfully" })
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" })
  }
}