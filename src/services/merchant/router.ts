import express from 'express';

import * as controller from './controller';
const jwt = require('express-jwt')

import { secret_key } from './../../../secret'

export const merchantRouter = express.Router();

/** POST /api/auth */
merchantRouter.route('/add-product').post(jwt(secret_key), controller.createProduct);
