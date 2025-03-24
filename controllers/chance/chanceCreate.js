// JS Strict Mode
"use strict";

// Import Packages
const fs = require("fs")
const path = require("path")
const { v4: uuid4 } = require('uuid');
const moment = require("moment");

// Import Models
const Chance = require('../../models/Chance');
const Student = require("../../models/Student");

// Import Utils 
const sendResponse = require('../../utils/sendResponse');
const sendEmail = require("../../utils/sendEmail");

// chanceCreate method for creating a chance
const chanceCreate = async (req, res) => {
    try {
        const chanceRegStartDate = new Date(req.body.chanceRegStartDate);
        const chanceRegEndDate = new Date(req.body.chanceRegEndDate);
        const chanceStartDate = new Date(req.body.chanceStartDate);
        const chanceEndDate = new Date(req.body.chanceEndDate);
        if (req.body.chanceImage) {
            let base64Data = req.body.chanceImage.replace(/^data:image\/\w+;base64,/, '')
            const bufferData = new Buffer.from(base64Data, 'base64');
            let generatedToken = uuid4();
            fs.writeFileSync(path.join("uploads/chances", `${generatedToken}-chance.png`), bufferData);
            req.body.chanceImage = `${process.env.SERVER_URL}/uploads/chances/${generatedToken}-chance.png`;
        } else {
            req.body.chanceImage = `${process.env.SERVER_URL}/uploads/chances/chance.jpg`;
        }
        
        if(req.body.documentsContent === "<p><br></p>") req.body.documentsContent = "";


        req.body.noOfClicks = 0;
        req.body.chanceRegStartDate = moment(chanceRegStartDate).format('YYYY-MM-DD');
        req.body.chanceRegEndDate = moment(chanceRegEndDate).format('YYYY-MM-DD');
        req.body.chanceStartDate = moment(chanceStartDate).format('YYYY-MM-DD');
        req.body.chanceEndDate = moment(chanceEndDate).format('YYYY-MM-DD');
        let chance = await new Chance(req.body).save();
        let chanceCategory = chance.chanceCategory;
        let students = await Student.find({ enable_notifications: true, interests: { $in: [chanceCategory] } });
        for (let i = 0; i < students.length; i++) {
            const mail = { mailService: process.env.SYSTEM_SERVICE_NODEMAILER, mailHost: process.env.SYSTEM_HOST_NODEMAILER, mailPort: Number(process.env.SYSTEM_PORT_NODEMAILER), mailAddress: process.env.SYSTEM_EMAIL_NODEMAILER, mailPassword: process.env.SYSTEM_PASS_NODEMAILER }
            const content = { subject: "فرصة ملائمة", title: "اضفنا فرصة جديدة ممكن تناسبك!", message: `عزيزي الطالب/ الطالبة، حبينا نبلغك إننا اضفنا فرصة جديدة في مجال [${chanceCategory}]، ونعتقد أنها ممكن تكون مناسبة لك! لا تضيع الفرصة، اضغط على الرابط وشوف التفاصيل الحين: [${ process.env.CLIENT_URL}/student/chance/${ chance._id }] - تحياتنا، فريق منصة خطط.` }
            await sendEmail(mail, students[i], content);
        }
        return sendResponse(res, 201, "تم إنشاء الفرصة بنجاح", chance);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export chanceCreate
module.exports = chanceCreate;