import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname, '../.env')});

export const ADMIN_JWT_SECRET: string = process.env.ADMIN_JWT_SECRET || 'secret1';
export const ADMIN_JWT_REFRESH_SECRET:string = process.env.ADMIN_JWT_REFRESH_SECRET || 'secret1';

export const USER_JWT_SECRET:string = process.env.JWT_REFRESH_SECRET || 'secret2';
export const USER_JWT_REFRESH_SECRET:string = process.env.USER_JWT_REFRESH_SECRET || 'secret2';

export const NODE_PORT: number =  parseInt( process.env.NODE_PORT || '3000' ) ;
export const REDIS_URL: string =   process.env.REDIS_URL || 'none';

export const DEFAULT_ADMIN_USERNAME: string = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
export const DEFAULT_ADMIN_PASSWORD: string = process.env.DEFAULT_ADMIN_PASSWORD || 'admin';