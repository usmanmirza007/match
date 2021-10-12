const express = require('express')
import { merchantRouter } from './merchant'
import { registerRouter } from './register'
import { loginRouter } from './login'

export const services = express.Router()

services.use('/merchant', merchantRouter)
services.use('/register', registerRouter)
services.use('/login', loginRouter)