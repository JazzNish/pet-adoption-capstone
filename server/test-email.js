import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Loads your .env file

console.log("Testing email with user:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Sending it to yourself to test!
    subject: 'FurEver System Test',
    text: 'If you are reading this, your Nodemailer is 100% working!'
};

console.log("Sending email... please wait...");

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("❌ ERROR FAILED TO SEND:");
        console.log(error.message);
    } else {
        console.log("✅ SUCCESS! Email sent:");
        console.log(info.response);
    }
});