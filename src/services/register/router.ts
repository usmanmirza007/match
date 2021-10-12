import express from 'express';

import * as controller from './controller';

export const registerRouter = express.Router();

/** POST /api/auth */
registerRouter.route('/').post(controller.registerRouter);
