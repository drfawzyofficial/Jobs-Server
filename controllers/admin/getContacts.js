// JS Strict Mode
"use strict";

// Import Packages

// Import Models
const Contact = require('../../models/Contact');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// getContacts method for getting contacts data
const getContacts = async (req, res) => {
    try {
        let page_no = parseInt(req.query.page_no);
        if(!page_no) {
            return sendResponse(res, 400, "رقم الصفحة إجباري");
        }
        if(page_no < 0) {
            return sendResponse(res, 400, "رقم الصفحة لا يمكن أن يكون رقمًا سلبيًا");
        }
        const contactsCount = Math.ceil(await Contact.find({ }).count() / 10)
        const contacts =  await Contact.find({ }).limit(10).skip(10 * (page_no - 1)).exec()
        return sendResponse(res, 200, "تم استرجاع بيانات الطلاب بنجاح", {contacts, contactsCount});
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export getContacts
module.exports = getContacts;