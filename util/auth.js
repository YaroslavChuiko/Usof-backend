import Cookies from 'cookies';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { TOKEN_EXPIRE_SEC, TOKEN_SECRET } from './const';

export function generateAccessToken(payload) {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE_SEC });
}

export function verifyAccessToken(token) {
  // let decoded;

  // try {
    const  decoded = jwt.verify(token, TOKEN_SECRET);
  // } catch (err) {
  //   throw new Error('Invalid Token');
    // return res.status(401).json({ message: 'Invalid Token' });
  // }

  return decoded;
}

export function generateToken() {
  return crypto.randomBytes(64).toString('hex');
}

export function withAuthUser(req, res) {
  const cookies = new Cookies(req, res);
  const token = cookies.get('token');
  let decoded;

  if (!token) {
    res.status(401).json({ message: 'Only for authorized users' });
  }

  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    res.status(401).json({ message: 'Invalid Token' }); // ? throw new err with msg and trycatch outside
  }

  return decoded;
}

export function withAuthAdmin(req, res) {
  const cookies = new Cookies(req, res);
  const token = cookies.get('token');
  let decoded;

  if (!token) {
    res.status(401).json({ message: 'Only for authorized users' });
  }

  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    res.status(401).json({ message: 'Invalid Token' });
  }

  if (decoded.role !== 'admin') {
    res.status(403).json({ message: 'Only for admin users' });
  }

  return decoded;
}
