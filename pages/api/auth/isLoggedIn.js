import Cookies from 'cookies';
import { generateAccessToken, verifyAccessToken } from '../../../util/auth';
import { TOKEN_EXPIRE_SEC } from '../../../util/const';

// /api/auth/isLoggedIn
export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function handleGET(req, res) {
  const cookies = new Cookies(req, res);
  let userData = null;
  const { token } = req.cookies;
  const { success, decoded } = verifyAccessToken(token);

  if (success) {
    userData = {
      id: decoded.id,
      login: decoded.login,
      fullName: decoded.fullName,
      email: decoded.email,
      emailVerified: decoded.emailVerified,
      avatar: decoded.avatar,
      role: decoded.role,
      rating: decoded.rating,

    };

    //refresh token
    const newToken = generateAccessToken(userData);
    cookies.set('token', newToken, {
      sameSite: 'lax',
      maxAge: TOKEN_EXPIRE_SEC * 1000,
      httpOnly: true,
    });
  }

  return res.status(200).json({ success: success, user: userData });
}
