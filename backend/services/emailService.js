const nodemailer = require("nodemailer");
const Setting = require("../models/Setting");

/**
 * Sends an email using the configured transporter.
 * @param {Object} options - Email options (to, subject, html)
 */
const sendEmail = async (options) => {
  // Use environment variables for transporter config
  // For production, you'd use SendGrid, Mailtrap, or a real SMTP server
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  return { success: !!info.messageId, messageId: info.messageId };
};

/**
 * Generates email content based on templates in Setting model.
 * @param {string} type - Template type (e.g., 'verification', 'welcome', 'reset')
 * @param {Object} user - User information
 * @param {string} token - Optional token for links
 */
const getEmailTemplate = async (type, user, token = "") => {
  const settings = await Setting.findOne();
  if (!settings || !settings.emailTemplates) {
    throw new Error("Email templates not found in settings");
  }

  const template = settings.emailTemplates.find((t) => t.type === type);
  if (!template || !template.enabled) {
    // Fallback or generic templates can be implemented here
    return null;
  }

  let content = template.content;
  let subject = template.subject;

  // Replace variables
  const replacements = {
    "{firstName}": user.firstName,
    "{lastName}": user.lastName,
    "{userName}": user.userName || user.email,
    "{email}": user.email,
    "{hotelName}": settings.hotelInfo?.name || "Suave By Chloe",
    "{hotelAddress}": settings.hotelInfo?.address || "",
    "{token}": token,
    "{verificationUrl}": `${settings.hotelInfo.website}/verify-email/${token}`,
    "{resetUrl}": `${settings.hotelInfo.website}/reset-password/${token}`,
  };

  Object.keys(replacements).forEach((placeholder) => {
    content = content.replace(
      new RegExp(placeholder, "g"),
      replacements[placeholder]
    );
    subject = subject.replace(
      new RegExp(placeholder, "g"),
      replacements[placeholder]
    );
  });

  return { subject, html: content };
};

module.exports = {
  sendEmail,
  getEmailTemplate,
};
