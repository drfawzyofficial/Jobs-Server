// JS Strict Mode
"use strict";

// Import Models
const Contact = require('../../models/Contact');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');
const sendEmail = require('../../utils/sendEmail');

// sendContactMessage method for sending a message to a student
const sendContactMessage = async (req, res) => {
    try {
        const { _id, message } = req.body;
        let contact = await Contact.findById({ _id: _id });
        if(!contact) 
            return sendResponse(res, 404, "التواصل غير موجود");
        if(message.trim().length === 0)
            return sendResponse(res, 404, "حقل الرسالة لا يمكن أن يكون فارغًا");
        const mail = { mailService: process.env.SYSTEM_SERVICE_NODEMAILER, mailHost: process.env.SYSTEM_HOST_NODEMAILER, mailPort: Number(process.env.SYSTEM_PORT_NODEMAILER), mailAddress: process.env.SYSTEM_EMAIL_NODEMAILER, mailPassword: process.env.SYSTEM_PASS_NODEMAILER }
        const content = { subject: "إرسالة رسالة", title: "منصة الفرص", message: message.trim()}
        await sendEmail(mail, contact, content);
        return sendResponse(res, 200, "تم إرسال الرسالة بنجاح");
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export studentMessage
module.exports = sendContactMessage;