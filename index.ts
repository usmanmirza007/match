import express from 'express'
// require('dotenv').config()
import cors from 'cors'

import { services } from './src/services/index'

const app = express();

// Middlewares

// Mount REST on /api
app.use(express.json())
app.use(cors());
app.use('/api', services);

const port = 8000;

app.listen(port, () =>
    console.log(`Express app listening on localhost:${port}`)
);
