// JS Strict Mode
"use strict";

// Import Models
const Chance = require('../../models/Chance');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// getWishlists method for getting wishlists
const getWishlists = async (req, res) => {
    try {
        let page_no = parseInt(req.query.page_no);
        const wishlists = req.body.wishlists;
        if(!page_no) {
            return sendResponse(res, 400, "رقم الصفحة إجباري");
        }
        if(page_no < 0) {
            return sendResponse(res, 400, "رقم الصفحة لا يمكن أن يكون رقمًا سلبيًا");
        }
        const wishlistsDB = await Chance.find({ _id: { $in: wishlists } }).limit(8).skip(8 * (page_no - 1)).exec();
        const wishlistsPagesCount = Math.ceil(await Chance.find({ _id: { $in: wishlists } }).count() / 8)
        const wishlistsCount = await Chance.find({ _id: { $in: wishlists } }).count();

        const result = { wishlists: wishlistsDB, wishlistsPagesCount: wishlistsPagesCount,  wishlistsCount: wishlistsCount, }
        return sendResponse(res, 200, "تم استرجاع المفضلات بنجاح بنجاح", result);
    } catch (err) {
        console.log(err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export getWishlists
module.exports = getWishlists;