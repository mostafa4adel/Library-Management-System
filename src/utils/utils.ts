import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const generate_token = (id: number) => {  
    return jwt.sign( id.toString() , JWT_SECRET || '');
}

export const decode_token = (token: string):number => {
    return parseInt(jwt.decode(token) as string);
}