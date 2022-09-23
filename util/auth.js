import Cookies from 'cookies';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { TOKEN_EXPIRE_SEC, TOKEN_SECRET } from './const';

export function generateUniqueToken() {
  return uuidv4();
}

export function generateAccessToken(payload) {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE_SEC });
}

export function verifyAccessToken(token) {
  const result = {
    success: true,
    message: '',
    decoded: null,
  };

  if (!token) {
    result.success = false;
    result.message = 'Only for authorized users';
    return result;
  }

  try {
    const  decoded = jwt.verify(token, TOKEN_SECRET);
    result.success = true,
    result.decoded = decoded;
  } catch (err) {
    result.success = false;
    result.message = 'Invalid Token';
  }

  return result;
}

export function withAuthUser(req, res) {
  const cookies = new Cookies(req, res);
  const token = cookies.get('token');
  let result = {
    success: true,
    message: '',
    decoded: null,
  }

  result = verifyAccessToken(token);

  if(result.success) {
    return result;
  } 

  res.status(401).json({success: result.success, message: result.message})

  return result;
}

export function withAuthAdmin(req, res) {
  const cookies = new Cookies(req, res);
  const token = cookies.get('token');
  let result = {
    success: true,
    message: '',
    decoded: null,
  }

  result = verifyAccessToken(token);

  if(result.success && result.decoded.role === 'admin') {
    return result;
  } 

  res.status(403).json({success: result.success, message: 'Only for admin users'})

  return result;
}
