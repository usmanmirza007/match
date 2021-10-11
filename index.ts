import express from 'express'
// require('dotenv').config()

import { merchant } from './src/merchant/index'

const app = express();

// Middlewares

// Mount REST on /api
app.use(express.json())
app.use('/api', merchant);


const port = 3000;

app.listen(port, () =>
    console.log(`Express app listening on localhost:${port}`)
);
