// JS Strict Mode
"use strict";

// Import Models
const Contact = require('../../models/Contact');
const Student = require('../../models/Student');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');
const sendEmail = require('../../utils/sendEmail');

// sendContactMessage method for sending a message to a student
const sendContactMessage = async (req, res) => {
    try {
        const { _id, message } = req.body;
        let contact = await Contact.findById({ _id: _id });
        if (!contact)
            return sendResponse(res, 404, "جهه التواصل غير موجودة");
        let student = await Student.findById({ _id: contact._studentID });
        if (!student)
            return sendResponse(res, 404, "الطالب غير موجود");
        if (!message || typeof (message) !== "string" || message.trim().length === 0 || message.trim().length < 100 || message.trim().length > 500)
            return sendResponse(res, 400, "حقل الرسالة يجب أن يكون بين 100 و500 أحرف");
        const mail = { mailService: process.env.SYSTEM_SERVICE_NODEMAILER, mailHost: process.env.SYSTEM_HOST_NODEMAILER, mailPort: Number(process.env.SYSTEM_PORT_NODEMAILER), mailAddress: process.env.SYSTEM_EMAIL_NODEMAILER, mailPassword: process.env.SYSTEM_PASS_NODEMAILER }
        const content = { subject: "الرد على الاستفسار", title: "منصة الفرص", message: message.trim()}
        await sendEmail(mail, student, content);
        await Contact.findByIdAndRemove({ _id: _id});
        return sendResponse(res, 200, "تم إرسال الرسالة بنجاح");
    } catch (err) {
        console.log(err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export studentMessage
module.exports = sendContactMessage;