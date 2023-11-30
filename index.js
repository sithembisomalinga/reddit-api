import express from 'express';
import cors from 'cors';
import productRoute from './Routes/postRoutes.js'

import config from './Config.js';

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use('/api', productRoute);

app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);