import express from 'express';

import * as controller from './controller';
const jwt = require('express-jwt')

import { secret_key } from '../../../secret'

export const userRouter = express.Router();

/** POST /api/auth */

userRouter.route('/').post(controller.createUser);
userRouter.route('/').get(controller.getUsers);


