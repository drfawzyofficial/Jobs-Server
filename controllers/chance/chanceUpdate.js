// JS Strict Mode
"use strict";

// Import Packages
const fs = require("fs")
const path = require("path")
const { v4: uuid4 } = require('uuid');
const moment = require("moment");
// Import Models
const Chance = require('../../models/Chance');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// chanceUpdate method for creating a chance
const chanceUpdate = async (req, res) => {
    try {
        let chance = await Chance.findById({ _id: req.body._id });
        if (!chance)
            return sendResponse(res, 404, "الفرصة غير موجودة");
        const chanceRegStartDate = new Date(req.body.chanceRegStartDate);
        const chanceRegEndDate = new Date(req.body.chanceRegEndDate);
        const chanceStartDate = new Date(req.body.chanceStartDate);
        const chanceEndDate = new Date(req.body.chanceEndDate);
        if (req.body.chanceImage) {
            let base64Data = req.body.chanceImage.replace(/^data:image\/\w+;base64,/, '')
            const bufferData = new Buffer.from(base64Data, 'base64');
            let generatedToken = uuid4();
            fs.writeFileSync(path.join("uploads/chances", `${req.body._id}-chance.png`), bufferData);
            req.body.chanceImage = `${process.env.SERVER_URL}/uploads/chances/${req.body._id}-chance.png`;
        } else {
            req.body.chanceImage = chance.chanceImage;
        }
        req.body.noOfClicks = chance.noOfClicks;
        req.body.chanceRegStartDate = moment(chanceRegStartDate).format('YYYY-MM-DD');
        req.body.chanceRegEndDate = moment(chanceRegEndDate).format('YYYY-MM-DD');
        req.body.chanceStartDate = moment(chanceStartDate).format('YYYY-MM-DD');
        req.body.chanceEndDate = moment(chanceEndDate).format('YYYY-MM-DD');
        chance = await Chance.findByIdAndUpdate({ _id: req.body._id }, req.body, { new: true });
        return sendResponse(res, 200, "تم تعديل الفرصة بنجاح", chance);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export chanceUpdate
module.exports = chanceUpdate;