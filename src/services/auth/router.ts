import express from 'express';
import * as controller from './controller';

export const authRouter = express.Router();

/** POST /api/auth */
authRouter.route('/signup').post(controller.registerRouter);
authRouter.route('/login').post(controller.loginRouter);

