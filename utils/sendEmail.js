
// JS Strict Mode
"use strict";

const nodemailer = require("nodemailer");

/**
 * Sends an email using nodemailer.
 * @param {Object} mail - Configuration object for the mail service.
 * @param {Object} user - Recipient details.
 * @param {Object} content - The content of the email including subject and message.
 */
const sendEmail = async (mail, user, content) => {
    const transporter = nodemailer.createTransport({
        service: mail.mailService,
        host: mail.mailHost,
        port: mail.mailPort,
        auth: {
            user: mail.mailAddress,
            pass: mail.mailPassword,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: mail.email,
        to: user.email,
        subject: content.subject,
        html: `
            <h2>${content.title}</h2>
            <p>${content.message}</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
