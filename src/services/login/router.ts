import express from 'express';

import * as controller from './controller';

export const loginRouter = express.Router();

/** POST /api/auth */
loginRouter.route('/').post(controller.loginMerchant);
