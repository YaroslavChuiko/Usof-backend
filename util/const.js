import path from 'path';

export const SAULT_ROUNDS = 10;
export const TOKEN_EXPIRE_SEC = 60 * 60 * 24 * 3; // 3 days
export const TOKEN_SECRET = 'secret';
export const DEFAULT_AVATAR_PATH = 'defaultAvatar/defaultAvatar.jpg';
export const UPLOADS_PATH = path.join(process.cwd(), 'public', 'uploads');