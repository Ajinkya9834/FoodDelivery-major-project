import nodemailer from "nodemailer";
import env from "dotenv";


// env configuration
env.config();

//create a transporter using your email provider
//the sender
const transporter = nodemailer.createTransport({
    service:"gmail",
    secure: true,
    port: 465, //true onlt for this port
    auth:{
        user: process.env.EMAIL, // email from where email is sent after successfull payment
        pass: process.env.PASSWORD, //password of above email
    },
});

async function sendPaymentSuccessEmail(custEmail, orderId, amount) {
    //the email that receiver will get
    const receiver = {
        from: process.env.EMAIL,
        to: custEmail,
        subject: "Payment successful",
        text: `Food Delivery
        
        Payment Successful! 
        Your Order ID: ${orderId}
        Amount Paid: ₹${amount}
        
        Thank you for your order. We look forward to serving you again!` };
    
    try {
        //email will get send
        const info = await transporter.sendMail(receiver);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);   
    }

}


export default sendPaymentSuccessEmail;


