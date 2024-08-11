import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { logErrorToSentry } from "../sentry/index.js";

const email = process.env.NODEMAILER_MAIL;
const password = process.env.NODEMAILER_PASSWORD;

const mailTransporter = (() => {
  console.log("Nodemailer initialized! 👍");
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });
})();

export const sendWelcomeMail = (to, name) => {
  let mailDetails = {
    from: email,
    to,
    subject: "Welcome to ATOM",
    html: `
    <h3>Hi ${name},</h3>
    <p>Thanks for signing up to Atom. We are very excited to have you on board.</p>
    <div style="text-align:center;margin:20px 0 30px 0;">
      <a href="https://atom.think-digital.in/" style="text-decoration:none;color:white;border:none;outline:none;padding:10px;background:#2596be;">Explore now</a>
    </div>
    <p>Need help, or have questions? Just reply to this email, we'd love to help.</p>
    <p>Cheers,</p>
    <p>Support Team</p>`,
  };
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs", err);
      logErrorToSentry(err, {
        workflow: "sendWelcomeMail",
      });
    } else {
      console.log("Email sent successfully", data);
    }
  });
};

export const sendForgotPasswordMail = (to, name) => {
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
      logErrorToSentry(err, {
        workflow: "sendForgotPasswordMail",
      });
    } else {
      console.log("Email sent successfully", data);
    }
  });
  return OTP;
};

export const sendEventInviteMail = async (to, name, event) => {
  try {
    const { name: title, type, domain, description, meta, duration, eventLink } = event;
    const { from, to: toTime } = duration;
    const startDate = new Date(from).toDateString();
    const startTime = new Date(from).toLocaleTimeString("en-US", { hour12: true, hour: "numeric", minute: "numeric" });
    const endDate = new Date(toTime).toDateString();
    const endTime = new Date(toTime).toLocaleTimeString("en-US", { hour12: true, hour: "numeric", minute: "numeric" });
    const { isShareable, isInternal, isFree, isWPS } = meta;
    let mailDetails = {
      from: email,
      to,
      subject: "Event Invitation",
      html: `
    <h3>Hi ${name},</h3>
    <p>Greetings from Think Digital.</p>
    <p>You have been invited to attend the event <b>${title}</b> on <b>${startDate}</b> at <b>${startTime}</b>.</p>
    <p>Event Details:</p>
    <ul>
      <li><b>Type:</b> ${type}</li>
      <li><b>Domain:</b> ${domain}</li>
      <li><b>Description:</b> ${description}</li>
      <li><b>Duration:</b> ${startDate} ${startTime} to ${endDate} ${endTime}</li>
      <li><b>More information:</b> ${isShareable ? "Shareable" : "Not Shareable"}, ${isInternal ? "Internal" : "External"}, ${isFree ? "Free" : "Paid"}, ${isWPS ? "WPS" : "Non-WPS"}</li>
    </ul>
    <div style="text-align:center;margin:20px 0 30px 0;">
      <a href="${eventLink}" style="text-decoration:none;color:white;border:none;outline:none;padding:10px;background:#2596be;">Join now</a>
    </div>
    <p>Need help, or have questions? Just reply to this email, we'd love to help.</p>
    <p>Cheers,</p>
    <p>Support Team</p>`,
    };
    await mailTransporter.sendMail(mailDetails);
    console.log("Email sent successfully! 👍");
  } catch (error) {
    logErrorToSentry(error, {
      workflow: "sendEventInviteMail",
    });
    console.log("Nodemailer error:", error);
  }
};

export const sendTaskReminderMail = async (to, name, task) => {
  try {
    const { title, description, dueDate, assignor } = task;
    const deadlineDate = new Date(dueDate).toDateString();
    const deadlineTime = new Date(dueDate).toLocaleTimeString("en-US", { hour12: true, hour: "numeric", minute: "numeric" });
    let mailDetails = {
      from: email,
      to,
      subject: "Task Reminder",
      html: `
    <h3>Hi ${name},</h3>
    <p>Greetings from Think Digital.</p>
    <p>You have been assigned a task <b>${title}</b> by <b>${assignor}</b>
    with deadline on <b>${deadlineDate}</b> at <b>${deadlineTime}</b>.</p>
    <p>Task Details:</p>
    <ul>
      <li><b>Description:</b> ${description}</li>
      <li><b>Deadline:</b> ${deadlineDate} ${deadlineTime}</li>
    </ul>
    <div style="text-align:center;margin:20px 0 30px 0;">
      <a href="https://atom.think-digital.in/" style="text-decoration:none;color:white;border:none;outline:none;padding:10px;background:#2596be;">Explore now</a>
    </div>
    <p>Need help, or have questions? Just reply to this email, we'd love to help.</p>
    <p>Cheers,</p>
    <p>Support Team</p>`,
    };
    await mailTransporter.sendMail(mailDetails);
    console.log("Email sent successfully! 👍");
  } catch (error) {
    logErrorToSentry(error, {
      workflow: "sendTaskReminderMail",
    });
    console.log("Nodemailer error:", error);
  }
};
