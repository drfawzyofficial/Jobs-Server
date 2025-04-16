// JS Strict Mode
"use strict";

// Import Packages
const bcrypt = require("bcryptjs");
const moment = require("moment");

// Import Models
const Student = require('../../models/Student');
const Code = require('../../models/Code');
const Helper = require("../../models/Helper");

// Import Utilities
const sendResponse = require('../../utils/sendResponse');
const sendEmail = require('../../utils/sendEmail');
const { inRange, isRequired, isString, isBoolean, isMinLength, matchesRegex, isInList, isMinArrayLength, isConfirmed } = require("../../utils/funcs");


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

const IELTSs = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, "0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"];
const CEFRs = ["A1", "A2", "B1", "B2", "C1", "C2"];

/**
 * Method for student signup.
 * Creates a new student account and sends a verification code via email.
 */
const studentSignup = async (req, res) => {
    try {
        // ExtrACT student details from the request body
        const { first_name, last_name, email, phone, password, password_confirmation, applicantGender, applicantEdu, saudinationality, saudiCity, tookEnglishTest, tookBrainTest, interests, Subinterests, acceptConditions, enable_notifications } = req.body;
        const errors = {};
        var DOB = req.body.DOB;
        var EnglishStandard = req.body.EnglishStandard;
        var BrainStandard = req.body.BrainStandard;

        const email_found = await Student.findOne({ email: email });

        const phone_found = await Student.findOne({ phone: phone });

        if (email_found)
            errors["email_found"] = ["البريد الإلكتروني موجود سابقًا"];

        if (phone_found)
            errors["phone_found"] = ["رقم الهاتف موجود سابقًا"];



        const helper = await Helper.findById(process.env.HELPER_ID);

        if (!isRequired(first_name) || !isString(first_name) || !isMinLength(first_name, 2)) {
            errors["first_name"] = ["الاسم الأول يجب الأ يقل عن 3 أحرف."];
        }

        if (!isRequired(last_name) || !isString(last_name) || !isMinLength(last_name, 2)) {
            errors["last_name"] = ["الاسم الأخير يجب الأ يقل عن 3 أحرف."];
        }

        if (!isRequired(email) || !isString(email) || !matchesRegex(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            errors["email"] = ["البريد الإلكتروني غير صالح."];
        }

        if (!isRequired(phone) || !isString(phone) || !matchesRegex(phone, /^05\d{8}$/)) {
            errors["phone"] = ["رقم الهاتف يجب أن يكون على الصيغة الموضحة"];
        }

        if (!isRequired(password) || !isString(password) || !isMinLength(password, 6) || !matchesRegex(password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)) {
            errors["password"] = ["يجب أن تتكون كلمة المرور من 6 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم."];
        }

        if (!isRequired(password_confirmation) || !isConfirmed(password, password_confirmation)) {
            errors["password_confirmation "] = ["كلمة المرور غير متطابقة"];
        }

        if (!isRequired(applicantGender) || !isInList(applicantGender, ["ذكر", "أنثى"])) {
            errors["applicantGender"] = ["الجنس يجب أن يكون من النوع ذكر أو أنثى."];
        }

        if (!isRequired(DOB) || !matchesRegex(DOB, /^\d{4}-\d{2}-\d{2}$/)) {
            errors["DOB"] = ["تاريخ الميلاد غير صالح."];
        }

        if (!isRequired(applicantEdu) || !isString(applicantEdu)) {
            errors["applicantEdu"] = ["المستوى التعليمي مطلوب."];
        }

        if (!isRequired(saudinationality) || !isBoolean(saudinationality)) {
            errors["saudinationality"] = ["الجنسية السعودية يجب أن تكون قيمة منطقية (true أو false)."];
        }

        if (!isRequired(tookEnglishTest) || !isBoolean(tookEnglishTest)) {
            errors["tookEnglishTest"] = ["اختبار اللغة الإنجليزية يجب أن يكون قيمة منطقية."];
        }

        if (!isRequired(interests) || !isMinArrayLength(interests, 3)) {
            errors["interests"] = ["يجب اختيار 3 أنواع من الفرص على الأقل."];
        }

        if (!isRequired(Subinterests) || !isMinArrayLength(Subinterests, 3)) {
            errors["Subinterests"] = ["يجب اختيار 3 مجالات على الأقل."];
        }

        if (!isRequired(DOB) || !matchesRegex(DOB, /^\d{4}-\d{2}-\d{2}$/)) {
            errors["DOB"] = ["تاريخ الميلاد غير صالح."];
        }

        if (!helper.applicantEdus.includes(applicantEdu))
            errors["applicantEdu"] = ["يجب أن يكون المرحلة التعليمية صحيحة."]

        if (!saudiCities.includes(saudiCity))
            errors["saudiCity"] = ["يجب أن تكون المدينة صحيحة."];


        if (tookEnglishTest === false) {
            EnglishStandard = { IELTS: '', TOEFL: '', TOEIC: '', DUOLINGO: '', STEP: '', CEFR: '' };
        } else {
            if (!EnglishStandard)
                errors["EnglishStandard"] = ["يجب أن يكون معيار اللغة الإنجليزية صحيحًا"];
            else {

                // Define the properties to check
                const propertiesToCheck = ["IELTS", "TOEFL", "TOEIC", "DUOLINGO", "STEP", "CEFR"];

                // Check if the object contains at least one of the properties
                const hasProperty = propertiesToCheck.some(prop => EnglishStandard.hasOwnProperty(prop));

                // Output the result
                if (!hasProperty) {
                    errors["EnglishStandard"] = ['يجب أن يحتوى معيار اللغة الإنجليزية على إحدى خصائها'];
                }

                // Validate English standards
                if (EnglishStandard.IELTS && !IELTSs.includes(EnglishStandard.IELTS)) {
                    errors["IELTS"] = ['يجب أن تكون درجة الأيلتس بين 0 و9'];
                }
                if (EnglishStandard.TOEFL && !inRange(EnglishStandard.TOEFL, 0, 120)) {
                    errors["TOEFL"] = ['يجب أن تكون درجة الـ TOEFL بين 0 و120'];
                }
                if (EnglishStandard.TOEIC && !inRange(EnglishStandard.TOEIC, 0, 990)) {
                    errors["TOEIC"] = ['يجب أن تكون درجة الـ TOEIC بين 0 و990'];
                }
                if (EnglishStandard.DUOLINGO && !inRange(EnglishStandard.DUOLINGO, 0, 160)) {
                    errors["DUOLINGO"] = ['يجب أن تكون درجة الـ DUOLINGO بين 0 و160'];
                }
                if (EnglishStandard.STEP && !inRange(EnglishStandard.STEP, 0, 100)) {
                    errors["STEP"] = ['يجب أن تكون درجة الـ STEP بين 0 و100'];
                }
                if (EnglishStandard.CEFR && !CEFRs.includes(EnglishStandard.CEFR)) {
                    errors["CEFR"] = ['يجب أن يكون درجة الـ CEFR صحيحًا'];
                }
            }

        }

        if (tookBrainTest === false) {
            BrainStandard = { SAT: '', Qudrat: '', GAT: '', ACT: '', Talent: '', AchivementTest: '', SAAT: '' };
        } else {
            if (!BrainStandard)
                errors["BrainStandard"] = ["يجب أن يكون معيار القدرات العقلية صحيحًا"];
            else {
                // Define the properties to check
                const propertiesToCheck = ["SAT", "Qudrat", "GAT", "ACT", "Talent", "AchivementTest", "SAAT"];

                // Check if the object contains at least one of the properties
                const hasProperty = propertiesToCheck.some(prop => BrainStandard.hasOwnProperty(prop));

                // Output the result
                if (!hasProperty) {
                    errors["BrainStandard"] = ['يجب أن يحتوى معيار القدرات العقلية على إحدى خصائها'];
                }
                // Validate Brain standards
                if (BrainStandard.SAT && !inRange(BrainStandard.SAT, 0, 1600)) {
                    errors["SAT"] = ['يجب أن تكون درجة الـ SAT بين 0 و1600'];
                }
                if (BrainStandard.Qudrat && !inRange(BrainStandard.Qudrat, 0, 100)) {
                    errors["Qudrat"] = ['يجب أن تكون درجة القدرات بين 0 و100'];
                }
                if (BrainStandard.GAT && !inRange(BrainStandard.GAT, 0, 100)) {
                    errors["GAT"] = ['يجب أن تكون درجة الـ GAT بين 0 و100'];
                }
                if (BrainStandard.ACT && !inRange(BrainStandard.ACT, 0, 36)) {
                    errors["ACT"] = ['يجب أن تكون درجة الـ ACT بين 0 و36'];
                }
                if (BrainStandard.Talent && !inRange(BrainStandard.Talent, 0, 2000)) {
                    errors["Talent"] = ['يجب أن تكون درجة مقياس موهبة بين 0 و2000'];
                }
                if (BrainStandard.AchivementTest && !inRange(BrainStandard.AchivementTest, 0, 100)) {
                    errors["AchivementTest"] = ['يجب أن تكون درجة الاختبار التحصيلي بين 0 و100'];
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


        if (!isRequired(acceptConditions) || !isBoolean(acceptConditions) || !isInList(acceptConditions, [true])) {
            errors["acceptConditions"] = ["يجب الموافقة على الشروط والأحكام."];
        }

        if (!isRequired(enable_notifications) || !isBoolean(enable_notifications) || !isInList(enable_notifications, [true, false])) {
            errors["enable_notifications"] = ["يجب تحديد إشعارات التطبيق."];
        }


        // Check for validation errors
        if (Object.keys(errors).length) {
            return sendResponse(res, 400, "فشل في عملية تحقق المدخلات", { errors });
        }

        // Create and save a new student
        const student = await new Student({ first_name, last_name, email, phone, password, applicantGender, DOB, applicantEdu, saudinationality, saudiCity, tookEnglishTest, EnglishStandard, tookBrainTest, BrainStandard, interests, Subinterests, acceptConditions, enable_notifications }).save();

        // Generate a random verification code (5 digits)
        const generatedCode = Math.floor(Math.random() * 90000) + 10000;

        // Hash the generated code using bcrypt
        const salt = await bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR));
        const hashedCode = await bcrypt.hash(String(generatedCode), salt);

        // Save the hashed code in the database, associated with the student's ID
        await new Code({ _studentID: student._id, code: hashedCode, for: "Signup" }).save();

        // Prepare mail configuration and content
        const mail = {
            mailService: process.env.SYSTEM_SERVICE_NODEMAILER,
            mailHost: process.env.SYSTEM_HOST_NODEMAILER,
            mailPort: Number(process.env.SYSTEM_PORT_NODEMAILER),
            mailAddress: process.env.SYSTEM_EMAIL_NODEMAILER,
            mailPassword: process.env.SYSTEM_PASS_NODEMAILER
        };
        const content = {
            subject: "تأكيد البريد الإلكتروني",
            title: "منصة الفرص",
           message: `الرمز الخاص بك هو ${generatedCode}. لاحظ أن الرمز صالح لمدة ساعة واحدة فقط.`
        };

        // Send verification code via email
        await sendEmail(mail, student, content);

        // Send success response
        return sendResponse(res, 201, "تم إنشاء حساب الطالب بنجاح");
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in studentSignup:", err.message);
        return sendResponse(res, 500, "حدث خطأ في خادم السيرفر", "حدث خطأ في خادم السيرفر");
    }
};

// Export the studentSignup function
module.exports = studentSignup;
