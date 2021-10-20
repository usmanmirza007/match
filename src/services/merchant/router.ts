import express from 'express';

import * as controller from './controller';
const jwt = require('express-jwt')

import { secret_key } from './../../../secret'

export const merchantRouter = express.Router();

/** POST /api/auth */
merchantRouter.route('/add-product').post(jwt(secret_key), controller.createProduct);
merchantRouter.route('/get-product/:merchantId').get(jwt(secret_key), controller.getProducts);
merchantRouter.route('/get-merchant').get(jwt(secret_key), controller.getMerchant);
merchantRouter.route('/edit-product').post(jwt(secret_key), controller.editProduct);
merchantRouter.route('/edit-merchant').post(jwt(secret_key), controller.editMerchant);
merchantRouter.route('/delete-merchant').delete(jwt(secret_key), controller.deleteMerchant);
merchantRouter.route('/delete-product').delete(jwt(secret_key), controller.deleteProduct);

