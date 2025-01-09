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

// Variables
const saudiCities = [
    "الرياض",
    "مكة المكرمة",
    "جدة",
    "المدينة المنورة",
    "الدمام",
    "الأحساء",
    "القطيف",
    "الخبر",
    "الجبيل",
    "الطائف",
    "الدرعية",
    "بريدة",
    "عنيزة",
    "الرس",
    "الخرج",
    "الدوادمي",
    "المجمعة",
    "شقراء",
    "الأفلاج",
    "حوطة بني تميم",
    "الحريق",
    "المزاحمية",
    "ثادق",
    "حريملاء",
    "الدلم",
    "القنفذة",
    "رابغ",
    "تربة",
    "الخرمة",
    "ينبع",
    "العلا",
    "البكيرية",
    "البدائع",
    "الخفجي",
    "رأس تنورة",
    "بقيق",
    "أبها",
    "خميس مشيط",
    "تبوك",
    "حائل",
    "عرعر",
    "جازان",
    "الريث",
    "ضمد",
    "نجران",
    "الباحة",
    "بلجرشي",
    "سكاكا",
    "دومة الجندل"
];

const IELTSDegrees = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, "0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"];
const CEFRDegrees = ["A1", "A2", "B1", "B2", "C1", "C2"];

/**
 * Controller for editing a student's profile data.
 * Validates and updates student details, and sends a verification code if the email is changed.
 */
const editProfile = async (req, res) => {
    try {
        // Extract request data
        // Extract student details from the request body
        const { first_name, last_name, email, phone, DOB, applicantGender, applicantEdu, saudinationality, saudiCity, tookEnglishTest, tookBrainTest, interests, Subinterests } = req.body;
        const errors = {};
        var EnglishStandard = req.body.EnglishStandard;
        var BrainStandard = req.body.BrainStandard;

        const helper = await Helper.findById(process.env.HELPER_ID);

        if (first_name.trim().length < 3)
            errors["first_name"] = ["يجب أن يكون الاسم الأول مكون من 3 أحرف"];

        if (last_name.trim().length < 3)
            errors["last_name"] = ["يجب أن يكون الاسم الأخير مكون من 3 أحرف"];

        if (!isValidDate(DOB))
            errors["DOB"] = ["يجب أن يكون التاريخ صالح"];

        if (!helper.applicantEdus.includes(applicantEdu))
            errors["applicantEdu"] = ["يجب أن يكون المرحلة التعليمية صحيحة"]


        if (!saudiCities.includes(saudiCity))
            errors["saudiCity"] = ["يجب أن تكون المدينة صحيحة"];

        if (tookEnglishTest === false) {
            EnglishStandard = { IELTSDegree: '', TOFELDegree: '', TOEICDegree: '', DUOLINGODegree: '', stepDegree: '', CEFRDegree: '' };
        } else {
            if (!EnglishStandard)
                errors["EnglishStandard"] = ["يجب أن يكون معيار اللغة الإنجليزية صحيحًا"];
            else {
                // Validate English standards
                if (EnglishStandard.IELTSDegree && !IELTSDegrees.includes(EnglishStandard.IELTSDegree)) {
                    errors["IELTSDegree"] = ['يجب أن تكون درجة الأيلتس بين 0 و9'];
                }
                if (EnglishStandard.TOFELDegree && !inRange(EnglishStandard.TOFELDegree, 0, 120)) {
                    errors["TOFELDegree"] = ['يجب أن تكون درجة التويفل بين 0 و120'];
                }
                if (EnglishStandard.TOEICDegree && !inRange(EnglishStandard.TOEICDegree, 0, 990)) {
                    errors["TOEICDegree"] = ['يجب أن تكون درجة التويك بين 0 و990'];
                }
                if (EnglishStandard.DUOLINGODegree && !inRange(EnglishStandard.DUOLINGODegree, 0, 160)) {
                    errors["DUOLINGODegree"] = ['يجب أن تكون درجة الدولينجو بين 0 و160'];
                }
                if (EnglishStandard.stepDegree && !inRange(EnglishStandard.stepDegree, 0, 100)) {
                    errors["stepDegree"] = ['يجب أن تكون درجة الاستب بين 0 و100'];
                }
                if (EnglishStandard.CEFRDegree && !CEFRDegrees.includes(EnglishStandard.CEFRDegree)) {
                    errors["CEFRDegree"] = ['يجب أن يكون معيار السيفر صحيحًا'];
                }
            }

        }

        if (tookBrainTest === false) {
            BrainStandard = { Sat: '', Qudrat: '', GAT: '', act: '', Talent: '', AchievementTest: '', SAAT: '' };
        } else {
            if (!BrainStandard)
                errors["BrainStandard"] = ["يجب أن يكون معيار القدرات العقلية صحيحًا"];
            else {
                // Validate Brain standards
                if (BrainStandard.Sat && !inRange(BrainStandard.Sat, 0, 1600)) {
                    errors["Sat"] = ['يجب أن تكون درجة الـ Sat بين 0 و1600'];
                }
                if (BrainStandard.Qudrat && !inRange(BrainStandard.Qudrat, 0, 100)) {
                    errors["Qudrat"] = ['يجب أن تكون درجة الكودرات بين 0 و100'];
                }
                if (BrainStandard.GAT && !inRange(BrainStandard.GAT, 0, 100)) {
                    errors["GAT"] = ['يجب أن تكون درجة الجات بين 0 و100'];
                }
                if (BrainStandard.act && !inRange(BrainStandard.act, 0, 36)) {
                    errors["act"] = ['يجب أن تكون درجة الاكت بين 0 و36'];
                }
                if (BrainStandard.Talent && !inRange(BrainStandard.Talent, 0, 2000)) {
                    errors["Talent"] = ['يجب أن تكون درجة التالنت بين 0 و2000'];
                }
                if (BrainStandard.AchievementTest && !inRange(BrainStandard.AchievementTest, 0, 100)) {
                    errors["AchievementTest"] = ['يجب أن تكون درجة الاختبار التحصيلي بين 0 و100'];
                }

                if (BrainStandard.SAAT && !inRange(BrainStandard.SAAT, 0, 100)) {
                    errors["SAAT"] = ['يجب أن تكون درجة الـ SAAT بين 0 و100'];
                }
            }
        }

        const isSubset_interests = interests.every(element => helper.chanceCategories.includes(element));
        if (!isSubset_interests)
            errors["interests"] = ["خطأ في قيم التصنيفات الرئيسية"];

        const isSubset_Subinterests = Subinterests.every(element => helper.chanceSubcategories.includes(element));
        if (!isSubset_Subinterests)
            errors["Subinterests"] = ["خطأ في قيم التصنيفات الفرعية"];



        // Check for validation errors
        if (Object.keys(errors).length) {
            return sendResponse(res, 400, "فشل في عملية تحقق المدخلات", { errors });
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
            await new Code({ _studentID: student._id, code: hashedCode, for: "Signup" }).save();

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

        const updatedProfile = await Student.findByIdAndUpdate(
            { _id: req.user._id },
            {
                first_name, last_name, email, phone, applicantGender, DOB, applicantEdu, saudinationality, saudiCity, tookEnglishTest, EnglishStandard, tookBrainTest, BrainStandard, interests, Subinterests, is_verified
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
