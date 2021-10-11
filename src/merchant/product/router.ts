import express from 'express';

import * as controller from './controller';

export const productRouter = express.Router();

/** POST /api/auth */
productRouter.route('/').post(controller.create);
