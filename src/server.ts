
import express from 'express';
import router from './router';
import {NODE_PORT} from './config';

const server = express();
server.use(express.json());
server.use('/api',router);


server.listen(3006 , '0.0.0.0', async () => {
    console.log(`Server running at http://0.0.0.0:${NODE_PORT}`);
});