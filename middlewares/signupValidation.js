// JS Strict Mode
"use strict";

// Packages and Utilities
const validator = require('../utils/validator');
const Validator = require('validatorjs');
const sendResponse = require('../utils/sendResponse');
const { ar } = require("../lang/lang");

/**
 * Middleware for validating signup requests.
 * Validates fullname, email, and password using custom rules.
 * 
 */

const nationalities = [
    'سعودي', 'أفغاني', 'ألباني', 'جزائري', 'أمريكي', 'أندوري', 'أنغولي', 'أنتيغوي', 'أرجنتيني',
    'أرميني', 'أسترالي', 'نمساوي', 'أذربيجاني', 'باهاماسي', 'بحريني', 'بنغلاديشي',
    'باربادوسي', 'بيلاروسي', 'بلجيكي', 'بليزي', 'بنين', 'بوتاني', 'بوليفي', 'بوسني',
    'برازيلي', 'بريطاني', 'بلغاري', 'بوركيني', 'بورمي', 'بوروندي', 'كمبودي', 'كاميروني',
    'كندي', 'كاب فيردي', 'تشادي', 'تشيلي', 'صيني', 'كولومبي', 'كوموري', 'كوستاريكي',
    'كرواتي', 'كوبي', 'قبرصي', 'تشيكي', 'كونغولي', 'دنماركي', 'جيبوتي', 'دومينيكي',
    'إكوادوري', 'مصري', 'إماراتي', 'غيني استوائي', 'إريتري', 'إستوني', 'إثيوبي', 'فنلندي',
    'فرنسي', 'غابوني', 'غامبي', 'جورجي', 'ألماني', 'غاني', 'يوناني', 'غرينادي', 'غواتيمالي',
    'غيني', 'غوياني', 'هايتي', 'هندوراسي', 'هنغاري', 'آيسلندي', 'هندي', 'إندونيسي', 'إيراني',
    'عراقي', 'إيرلندي', 'فلسطيني', 'إيطالي', 'جامايكي', 'ياباني', 'أردني', 'كازاخستاني',
    'كيني', 'كيريباتي', 'كوري', 'كويتي', 'قرغيزستاني', 'لاوسي', 'لاتفي', 'لبناني', 'ليبي',
    'ليتواني', 'لوكسمبورغي', 'مدغشقري', 'مالاوي', 'ماليزي', 'مالديفي', 'مالي', 'مالطي',
    'ماوريتاني', 'مكسيكي', 'مولدوفي', 'موناكوي', 'منغولي', 'مغربي', 'موزمبيقي', 'ناميبي',
    'نيبالي', 'هولندي', 'نيوزيلندي', 'نيجيري', 'نيكاراغوي', 'نيجيري', 'نرويجي', 'عماني',
    'باكستاني', 'بنمي', 'بابواني', 'باراغوي', 'بيروفي', 'فلبيني', 'بولندي', 'برتغالي',
    'قطري', 'روماني', 'روسي', 'رواندي', 'سانت لوسي', 'سلفادوري', 'ساموائي',
    'سنغالي', 'صربي', 'سيشلي', 'سنغافوري', 'سلوفاكي', 'سلوفيني', 'سومالي', 'جنوب أفريقي',
    'إسباني', 'سريلانكي', 'سوداني', 'سورينامي', 'سوازيلندي', 'سويدي', 'سويسري', 'سوري',
    'تايواني', 'طاجيكستاني', 'تنزاني', 'تايلاندي', 'توغولي', 'تونسي', 'تركي', 'تركماني',
    'توفالي', 'أوغندي', 'أوكراني', 'أوروغواي', 'أوزبكستاني', 'فانواتي', 'فنزويلي', 'فيتنامي',
    'يمني', 'زامبي', 'زيمبابوي'
];

const signupValidation = async (req, res, next) => {
    try {
        // Define validation rules
        const validationRule = {
            "first_name": "required|string|min:6",
            "last_name": "required|string|min:6",
            "email": "required|string|email|exist:Student,email",
            "phone": "required|string|min:10|max:15|regex:/^\\d+$/",
            "password": "required|string|min:6|strict|confirmed",
            "applicantGender": "required|string",
            "DOB": "required|date", 
            "applicantEdu": "required|string",
            "nationality": `required|string|in:${nationalities.join(',')}`,
            "saudiresiding": "required|boolean",
            "tookEnglishTest": "required|boolean",
            "tookBrainTest": "required|boolean",
            "interests": "required|array|min:3",
            "Subinterests": "required|array|min:3"
        };

        // "EnglishStandard": "at_least_one_english_standard",
        // Custom validation function to ensure at least one English standard is provided and its value is correct
        // Validator.register(
        //     'at_least_one_english_standard',
        //     (value, requirement, attribute) => {
        //         const englishStandard = value || {};
        //         const keys = [
        //             'IELTSDegree',
        //             'TOFELDegree',
        //             'TOEICDegree',
        //             'DUOLINGODegree',
        //             'stepDegree',
        //             'CEFRDegree'
        //         ];

        //         // Define a regex or value checks for each key if needed
        //         const validationRules = {
        //             IELTSDegree: (val) => !isNaN(val) && val >= 0 && val <= 9, // Must be a number between 0 and 9
        //             TOFELDegree: (val) => !isNaN(val) && val >= 0 && val <= 120, // Must be a number between 0 and 120
        //             TOEICDegree: (val) => !isNaN(val) && val >= 0 && val <= 990, // Must be a number between 0 and 990
        //             DUOLINGODegree: (val) => !isNaN(val) && val >= 0 && val <= 160, // Must be a number between 0 and 160
        //             stepDegree: (val) => !isNaN(val) && val >= 0 && val <= 100, // Must be a number between 0 and 100
        //             CEFRDegree: (val) => ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', ""].includes(val) // Must be one of the specified levels
        //         };

        //         if(Object.keys(englishStandard).length == 0) return false;
        //         return Object.keys(englishStandard).every((key) => {
        //             const val = String(englishStandard[key]).trim();
        //             return keys.includes(key) && validationRules[key](val);
        //         });

        //     },
        //     'مطلوب درجة قياسية واحدة على الأقل في اللغة الإنجليزية، ويجب أن تكون القيمة ضمن النطاق المسموح به.'
        // );

        //   "BrainStandard": "at_least_one_brain_standard",
        // Validator.register(
        //     'at_least_one_brain_standard',
        //     (value, requirement, attribute) => {
        //         const brainStandard = value || {};
        //         const keys = [
        //             'Sat',
        //             'Qudrat',
        //             'GAT',
        //             'act',
        //             'Talent'
        //         ];
        //         // Define validation rules for each key if needed
        //         const validationRules = {
        //             Sat: (val) => !isNaN(val) && val >= 0 && val <= 1600, // Must be a number between 0 and 1600
        //             Qudrat: (val) => !isNaN(val) && val >= 0 && val <= 100, // Must be a number between 0 and 100
        //             GAT: (val) => !isNaN(val) && val >= 0 && val <= 100, // Must be a number between 0 and 100
        //             act: (val) => !isNaN(val) && val >= 0 && val <= 36, // Must be a number between 1 and 36
        //             Talent: (val) => !isNaN(val) && val >= 0 && val <= 2000 // Must be a number between 0 and 2000
        //         };
        //         if(Object.keys(brainStandard).length == 0) return false;
        //         return Object.keys(brainStandard).every((key) => {
        //             const val = String(brainStandard[key]).trim();
        //             return keys.includes(key) && validationRules[key](val);
        //         });
        //     },
        //     'مطلوب درجة واحدة على الأقل في المعايير العقلية، ويجب أن تكون القيمة ضمن النطاق المسموح به.'
        // );
        

        // Perform validation
        await validator(req.body, validationRule, ar, (err, status) => {
            if (!status) {
                // If validation fails, send an error response
                return sendResponse(res, 400, "فشل في التحقق من المدخلات", err);
            }
            // Proceed to the next middleware if validation is successful
            next();
        });
    } catch (err) {
        // Log the error message for debugging
        console.error('Validation error:', err.message);
        // Optionally, send a response for the internal server error (if needed)
        return sendResponse(res, 500, "حدث خطأ داخلي في الخادم");
    }
};

// Export the signupValidation middleware
module.exports = signupValidation;
