import redis from 'redis';
import { REDIS_URL } from '../config';


const redis_client = redis.createClient({
    url: REDIS_URL,
});

// Handle connection errors
redis_client.on('error', (err: any) => {
    console.error(`Redis connection error: ${err}`);
});

module.exports = redis_client;


