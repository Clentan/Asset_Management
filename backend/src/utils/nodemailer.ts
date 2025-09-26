import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Gmail SMTP host
    port: 587,             // Use the correct port
    secure: false,         // false for port 587, true for port 465
    auth: {
        user: "scottfrankie864@gmail.com", // Your email
        pass: "vfeh kjux tbuf wzho",       // App password
    },
    tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
    },
});