import express from 'express';
import router from './router';
import { NODE_PORT } from './config';
import { initialize_database } from './utils/database_utils';

const server = express();
server.use(express.json());
server.use('/api', router);

initialize_database()
    .then(() => {
        server.listen(NODE_PORT, '0.0.0.0', () => {
            console.log(`Server running at http://0.0.0.0:${NODE_PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    });