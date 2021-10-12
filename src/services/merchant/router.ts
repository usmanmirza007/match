import express from 'express';

import * as controller from './controller';
const jwt = require('express-jwt')

import { secret_key } from './../../../secret'

export const merchantRouter = express.Router();

/** POST /api/auth */
merchantRouter.route('/add-product').post(jwt(secret_key), controller.createProduct);
merchantRouter.route('/get-product').get(jwt(secret_key), controller.getProduct);
merchantRouter.route('/get-merchant').get(jwt(secret_key), controller.getMerchant);
// merchantRouter.route('/edit-product').post(jwt(secret_key), controller.editProduct);
