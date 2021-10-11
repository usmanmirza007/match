const express = require('express')
import { productRouter } from './product'
export const merchant = express.Router()

merchant.use('/merchant', productRouter)