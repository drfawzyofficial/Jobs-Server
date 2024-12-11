// JS Strict Mode
"use strict";

// Import Packages
const fs = require("fs")
const path = require("path")
const { v4: uuid4 } = require('uuid');

// Import Models
const Chance = require('../../models/Chance');
const Student = require("../../models/Student");

// Import Utils 
const sendResponse = require('../../utils/sendResponse');
const sendEmail = require("../../utils/sendEmail");

// chanceCreate method for creating a chance
const chanceCreate = async (req, res) => {
    try {
        if (req.body.chanceImage) {
            let base64Data = req.body.chanceImage.replace(/^data:image\/\w+;base64,/, '')
            const bufferData = new Buffer.from(base64Data, 'base64');
            let generatedToken = uuid4();
            fs.writeFileSync(path.join("uploads/chances", `${generatedToken}-chance.png`), bufferData);
            req.body.chanceImage = `${process.env.SERVER_URL}/uploads/chances/${generatedToken}-chance.png`;
        } else {
            req.body.chanceImage = `${process.env.SERVER_URL}/uploads/chances/chance.jpg`;
        }

        req.body.noOfClicks = 0;
        let chance = await new Chance(req.body).save();
        const students = await Student.find({});
        let filtered_students = [];
        students.forEach((student) => {
            if (student.tags.includes(req.body.chanceCategory)) {
                filtered_students.push(student);
            }
        })
        let mail = { mailService: process.env.SYSTEM_SERVICE_NODEMAILER, mailHost: process.env.SYSTEM_HOST_NODEMAILER, mailPort: Number(process.env.SYSTEM_PORT_NODEMAILER), mailAddress: process.env.SYSTEM_EMAIL_NODEMAILER, mailPassword: process.env.SYSTEM_PASS_NODEMAILER }
        let content = { subject: "إشعار الفرصة", title: "منصة ا لوظائف", message: `:تم نشر الفرصة ${req.body.chanceName}` }

        filtered_students.forEach(async (student) => {
            await sendEmail(mail, student, content);
        })
        return sendResponse(res, 201, "تم إنشاء الفرصة بنجاح", chance);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export chanceCreate
module.exports = chanceCreate;