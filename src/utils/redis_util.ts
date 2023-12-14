import  { createClient  } from 'redis';
import { REDIS_URL } from '../config';

class Redis_Client{
    private static _instance: Redis_Client;
    private _client: any;

    constructor() {
        this._client = createClient({url:REDIS_URL});
        this._client.connect();

        this._client.on('connect', () => {

            console.log('Redis client connected');
        });

        this._client.on('error', (err : any) => {
            console.error('Redis client encountered an error:', err);
            // stop the server if redis is not available
            process.exit(1);
        });
    }

    public static get_client() {
        if (!Redis_Client._instance) {
            Redis_Client._instance = new Redis_Client();
        }

        return Redis_Client._instance._client;
    }

}

export { Redis_Client };