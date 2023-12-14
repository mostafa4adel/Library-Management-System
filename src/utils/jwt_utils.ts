import jwt from 'jsonwebtoken';
import { USER_JWT_REFRESH_SECRET , USER_JWT_SECRET, ADMIN_JWT_REFRESH_SECRET, ADMIN_JWT_SECRET } from '../config';

export const generate_access_token = (username: string, is_admin: boolean) : string  => {  

    const JWT_SECRET = is_admin ? ADMIN_JWT_SECRET : USER_JWT_SECRET;

    const accessToken = jwt.sign({ username: username }, JWT_SECRET || 'access_token', { expiresIn: '15m' })
    return accessToken;
}

export const validate_access_token = (token: string, is_admin:boolean): string | null => {
    try {
        const JWT_SECRET = is_admin ? ADMIN_JWT_SECRET : USER_JWT_SECRET;
        const decoded = jwt.verify(token, JWT_SECRET || 'access_token') as { [key: string]: any };
        return decoded.username;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            console.error('Token expired:', err);
        } else {
            console.error('Error decoding token:', err);
        }
        return null;
    }
};

export const generate_refresh_token = (username: string,is_admin:boolean) : string  => {
        
    const JWT_REFRESH_SECRET = is_admin ? ADMIN_JWT_REFRESH_SECRET : USER_JWT_REFRESH_SECRET;
    const refresh_token = jwt.sign({ username: username }, JWT_REFRESH_SECRET || 'refresh_token', { expiresIn: '1d' });
    return refresh_token;
    
};

export const validate_refresh_token = (token: string,is_admin:boolean): string | null => {
    try {
        const JWT_REFRESH_SECRET = is_admin ? ADMIN_JWT_REFRESH_SECRET : USER_JWT_REFRESH_SECRET;
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET || 'refresh_token') as { [key: string]: any };
        return decoded.username;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            console.error('Refresh token expired:', err);
        } else {
            console.error('Error decoding token:', err);
        }
        return null;
    }
}

export const is_borrower = (token: string): boolean => {
    try {
        const decoded = jwt.verify(token, USER_JWT_SECRET || '') as { [key: string]: any };
        return true;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            console.error('Token expired:', err);
        } else {
            console.error('Error decoding token:', err);
        }
        return false;
    }
}

export const is_admin = (token: string): boolean => {
    try {
        const decoded = jwt.verify(token, ADMIN_JWT_SECRET || '') as { [key: string]: any };
        return true;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            console.error('Token expired:', err);
        } else {
            console.error('Error decoding token:', err);
        }
        return false;
    }
}
