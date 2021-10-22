import express from 'express';
import * as controller from './controller';

var multer = require('multer')
var upload = multer({
    storage: multer.diskStorage({
        destination: (req: any, file: any, cb: any) => {
            cb(null, "uploads/");
        },
        filename: (req: any, file: any, cb: any) => {

            console.log(file.originalname);
            cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
        },
    }), fileFilter: (req: any, file: any, cb: any) => {

        if (
            file.mimetype.includes("excel") ||
            file.mimetype.includes("spreadsheetml")
        ) {
            cb(null, true);
        } else {
             return cb(new Error('Please upload only excel file.'), false);

        }
    }
})


export const registerRouter = express.Router();

/** POST /api/auth */
registerRouter.route('/').post(controller.registerRouter);
registerRouter.post("/upload", upload.single("file"), controller.registerBulkUserRouter);

