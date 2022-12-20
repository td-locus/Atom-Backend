const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

require("dotenv/config");

const email = process.env.NODEMAILER_MAIL;
const password = process.env.NODEMAILER_PASSWORD;

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
});

exports.sendWelcomeMail = (to, name) => {
  let mailDetails = {
    from: email,
    to,
    subject: "Welcome to ATOM",
    html: `
    <h3>Hi ${name},</h3>
    <p>Thanks for signing up to Atom. We are very excited to have you on board.</p>
    <div style="text-align:center;margin:20px 0 30px 0;">
      <a href="https://atomthinkdigital.netlify.app" style="text-decoration:none;color:white;border:none;outline:none;padding:10px;background:#2596be;">Explore now</a>
    </div>
    <p>Need help, or have questions? Just reply to this email, we'd love to help.</p>
    <p>Cheers,</p>
    <p>Support Team</p>`,
  };
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs", err);
    } else {
      console.log("Email sent successfully", data);
    }
  });
};

exports.sendForgotPasswordMail = (to, name) => {
  const OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false });

  let mailDetails = {
    from: email,
    to,
    subject: "Forgot Password",
    html: `
    <h3>Hi ${name},</h3>
    <p>Greetings from Think Digital.</p>
    <p>Your request for forgotten password has been processed. We are sharing a code, please use this code to reset your password.</p>
    <p>Code: <b style="color:white;padding:5px;background:#2596be;">${OTP}</b></p>
    <p>Need help, or have questions? Just reply to this email, we'd love to help.</p>
    <p>Cheers,</p>
    <p>Support Team</p>`,
  };
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs", err);
    } else {
      console.log("Email sent successfully", data);
    }
  });
  return OTP;
};
