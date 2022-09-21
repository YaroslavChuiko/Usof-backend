import path from 'path';

export const TYPE_SUCCESS = 'success';
export const TYPE_ERROR = 'error';
export const SAULT_ROUNDS = 10;
export const TOKEN_EXPIRE_SEC = 60 * 60 * 2; // 2h
export const TOKEN_SECRET = 'secret';
export const DEFAULT_AVATAR_PATH = 'defaultAvatar/defaultAvatar.jpg';
export const UPLOADS_PATH = path.join(process.cwd(), 'public', 'uploads');