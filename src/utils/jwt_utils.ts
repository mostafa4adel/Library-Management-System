import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../config';

export const generate_tokens = (id: number) => {  
    const accessToken = jwt.sign({ id: id.toString() }, JWT_SECRET || '', { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: id.toString() }, JWT_REFRESH_SECRET || '', { expiresIn: '1d' });
    return { accessToken, refreshToken };
}

export const decode_token = (token: string): number => {
    const decoded = jwt.decode(token) as { [key: string]: any };
    return parseInt(decoded?.id);
}

export const refresh_tokens = (refreshToken: string) => {
    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET || '') as { [key: string]: any };
        const id = parseInt(decoded?.id);
        return generate_tokens(id);
    } catch (err) {
        console.error('Error refreshing tokens:', err);
        return null;
    }
}