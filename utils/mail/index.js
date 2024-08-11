import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { logErrorToSentry } from "../sentry/index.js";
import { readFileSync } from "fs";
import path from "path";

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

const welcomeTemplate = readFileSync(new URL("./templates/welcome.html", import.meta.url), "utf-8");
const forgotPasswordTemplate = readFileSync(new URL("./templates/forgot_password.html", import.meta.url), "utf-8");
const taskReminderTemplate = readFileSync(new URL("./templates/task_reminder.html", import.meta.url), "utf-8");

function replacePlaceholders(template, data) {
  let output = template;
  for (const key in data) {
    output = output.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  }
  return output;
}

export const sendWelcomeMail = (to, name) => {
  const htmlContent = replacePlaceholders(welcomeTemplate, {
    name,
  });

  let mailDetails = {
    from: email,
    to,
    subject: `Welcome, ${name}! Start Exploring Atom Today 🚀`,
    html: htmlContent,
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
  const htmlContent = replacePlaceholders(forgotPasswordTemplate, {
    name,
    OTP,
  });
  let mailDetails = {
    from: email,
    to,
    subject: "Forgot Password",
    html: htmlContent,
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
      <li><b>More information:</b> ${isShareable ? "Shareable" : "Not Shareable"}, ${
        isInternal ? "Internal" : "External"
      }, ${isFree ? "Free" : "Paid"}, ${isWPS ? "WPS" : "Non-WPS"}</li>
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
    const deadlineTime = new Date(dueDate).toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
    const htmlContent = replacePlaceholders(taskReminderTemplate, {
      name,
      assignor,
      deadlineDate,
      deadlineTime,
      title,
      description,
    });
    let mailDetails = {
      from: email,
      to,
      subject: `New Task Assigned: ${title}`,
      html: htmlContent,
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
