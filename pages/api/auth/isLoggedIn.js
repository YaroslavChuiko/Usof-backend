import { verifyAccessToken } from '../../../util/auth';

// /api/auth/isLoggedIn
export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function handleGET(req, res) {
  let userData = null;
  const { token } = req.cookies;
  const { success, decoded } = verifyAccessToken(token);

  if (success) {
    userData = {
      id: decoded.id,
      login: decoded.login,
      fullName: decoded.fullName,
      email: decoded.email,
      active: decoded.active,
      avatar: decoded.avatar,
      role: decoded.role,
    };
  }

  return res.status(200).json({ success: success, user: userData });
}
