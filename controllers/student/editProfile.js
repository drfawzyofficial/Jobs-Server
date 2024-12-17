// JS Strict Mode
"use strict";

// Import Packages
const bcrypt = require("bcryptjs");

// Import Models
const Student = require('../../models/Student');
const Code = require('../../models/Code');
const Helper = require("../../models/Helper");

// Import Utilities
const sendResponse = require('../../utils/sendResponse');
const sendEmail = require('../../utils/sendEmail');
const { inRange, isValidDate } = require("../../utils/funcs");

/**
 * Controller for editing a student's profile data.
 * Validates and updates student details, and sends a verification code if the email is changed.
 */
const editProfile = async (req, res) => {
    try {
        // Extract request data
        const data = req.body;
        const errors = {};

        // Retrieve helper data
        const helper = await Helper.findById({ _id: process.env.HELPER_ID });
        const IELTSDegrees = helper.IELTSDegress;
        const CEFRDegrees = helper.CEFRDegrees;
        const applicantEdus = helper.applicantEdus.filter(el => el !== "المرحلة");
        const applicantNats = helper.applicantNats.filter(el => el !== "الجنسية");
        const chanceCategories = helper.chanceCategories.filter(el => el !== "التصنيف");

        // Validation checks
        if (!applicantNats.includes(data.applicantNat)) {
            errors["applicantNat"] = ['يجب أن تكون الجنسية صحيحة'];
        }
        if (!applicantEdus.includes(data.applicantEdu)) {
            errors["applicantEdu"] = ['يجب أن تكون المرحلة التعليمية صحيحة'];
        }
        if (!inRange(data.applicantAge, 18, 60)) {
            errors["age"] = ["العمر يجب أن يتراوح بين الـ 18 و60"];
        }
        if (!isValidDate(data.dOB)) {
            errors["DOB"] = ["يجب أن يكون التاريخ صالح"];
        }

        // Validate English standards
        if (data.EnglishStandard.IELTSDegree && !IELTSDegrees.includes(data.EnglishStandard.IELTSDegree)) {
            errors["IELTSDegree"] = ['يجب أن تكون درجة الأيلتس بين 0 و9'];
        }
        if (data.EnglishStandard.TOFELDegree && !inRange(data.EnglishStandard.TOFELDegree, 0, 120)) {
            errors["TOFELDegree"] = ['يجب أن تكون درجة التويفل بين 0 و120'];
        }
        if (data.EnglishStandard.TOEICDegree && !inRange(data.EnglishStandard.TOEICDegree, 0, 990)) {
            errors["TOEICDegree"] = ['يجب أن تكون درجة التويك بين 0 و990'];
        }
        if (data.EnglishStandard.DUOLINGODegree && !inRange(data.EnglishStandard.DUOLINGODegree, 0, 160)) {
            errors["DUOLINGODegree"] = ['يجب أن تكون درجة الدولينجو بين 0 و160'];
        }
        if (data.EnglishStandard.stepDegree && !inRange(data.EnglishStandard.stepDegree, 0, 100)) {
            errors["stepDegree"] = ['يجب أن تكون درجة الاستب بين 0 و100'];
        }
        if (data.EnglishStandard.CEFRDegree && !CEFRDegrees.includes(data.EnglishStandard.CEFRDegree)) {
            errors["CEFRDegree"] = ['يجب أن يكون معيار السيفر صحيحًا'];
        }

        // Validate Brain standards
        if (data.BrainStandard.Sat && !inRange(data.BrainStandard.Sat, 0, 1600)) {
            errors["Sat"] = ['يجب أن تكون درجة السات بين 0 و1600'];
        }
        if (data.BrainStandard.Qudrat && !inRange(data.BrainStandard.Qudrat, 0, 100)) {
            errors["Qudrat"] = ['يجب أن تكون درجة الكودرات بين 0 و100 '];
        }
        if (data.BrainStandard.GAT && !inRange(data.BrainStandard.GAT, 0, 100)) {
            errors["GAT"] = ['يجب أن تكون درجة الجات بين 0 ,100'];
        }
        if (data.BrainStandard.act && !inRange(data.BrainStandard.act, 0, 36)) {
            errors["act"] = ['يجب أن تكون درجة الاكت بين 0 و36'];
        }
        if (data.BrainStandard.Talent && !inRange(data.BrainStandard.Talent, 0, 2000)) {
            errors["Talent"] = ['يجب أن تكون درجة التالنت بين 0 و2000'];
        }

        // Validate Curriculum standards
        if (data.CurStandard.SaudiCur && !inRange(data.CurStandard.SaudiCur, 0, 100)) {
            errors["SaudiCur"] = ['يجب أن تكون درجة المنهج السعودي بين 0 و100'];
        }
        if (data.CurStandard.BritishCur && !inRange(data.CurStandard.BritishCur, 0, 100)) {
            errors["BritishCur"] = ['يجب أن تكون درجة المنهج البريطاني بين 0 و100'];
        }

        // Check for validation errors
        if (Object.keys(errors).length) {
            return sendResponse(res, 400, "فشل في عملية تحقق المدخلات", { errors });
        }

        // Validate tags
        const uniqueTags = [...new Set(req.body.tags)];
        const invalidTags = uniqueTags.some(tag => !chanceCategories.includes(tag));
        if (invalidTags) {
            return sendResponse(res, 202, "خطأ في الكلمات المفتاحية");
        }

        // Find the student and check for email changes
        const student = await Student.findOne({ _id: req.user._id });
        const emailExists = await Student.findOne({ email: req.body.email, _id: { $ne: student._id } });
        if (emailExists) {
            return sendResponse(res, 202, "هناك طالب آخر لديه هذا الحساب");
        }

        // If the email has changed, send a verification code
        let is_verified = req.body.email === student.email ? student.is_verified : false;
        if (req.body.email !== student.email) {
            const existingCode = await Code.findOne({ _studentID: req.user._id });
            const generatedCode = Math.floor(Math.random() * 90000) + 10000;
            const salt = await bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR));
            const hashedCode = await bcrypt.hash(String(generatedCode), salt);

            // Delete any existing code and save the new one
            if (existingCode) {
                await Code.findOneAndDelete({ _studentID: req.user._id });
            }
            await new Code({ _studentID: student._id, code: hashedCode }).save();

            // Prepare mail configuration and content
            const mail = {
                mailService: process.env.SYSTEM_SERVICE_NODEMAILER,
                mailHost: process.env.SYSTEM_HOST_NODEMAILER,
                mailPort: Number(process.env.SYSTEM_PORT_NODEMAILER),
                mailAddress: process.env.SYSTEM_EMAIL_NODEMAILER,
                mailPassword: process.env.SYSTEM_PASS_NODEMAILER,
            };
            const user = { email: req.body.email };
            const content = {
                subject: "تأكيد البريد الإلكتروني",
                title: "منصة الفرص",
                message: `الكود الخاص بك هو ${generatedCode}. لاحظ أن الكود صالح فقط لمدة ساعة واحدة `
            };
            await sendEmail(mail, user, content);
        }

        // Update the student's profile data
        const {
            gender, applicantAge, dOB, fullname, email, bio, tags,
            applicantNat, applicantEdu, EnglishStandard, BrainStandard, CurStandard
        } = req.body;
        
        const updatedProfile = await Student.findByIdAndUpdate(
            { _id: req.user._id },
            {
                gender, applicantAge, dOB, fullname, email, is_verified, bio, tags,
                applicantNat, applicantEdu, EnglishStandard, BrainStandard, CurStandard
            },
            { new: true }
        );

        // Send success response with the updated profile data
        return sendResponse(res, 200, "تم تحديث بيانات الطالب بنجاح", updatedProfile);
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in editProfile:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export editProfile
module.exports = editProfile;
