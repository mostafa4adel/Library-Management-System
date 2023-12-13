import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname, '../.env')});

export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';
export const NODE_PORT: number =  parseInt( process.env.NODE_PORT || '3000' ) ;
export const REDIS_URL: string =   process.env.REDIS_HOST || 'none';
