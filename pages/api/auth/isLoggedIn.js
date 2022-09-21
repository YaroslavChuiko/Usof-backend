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
  const { token } = req.cookies;
  const result = verifyAccessToken(token);

  return res.status(200).json({ success: result.success, user: result.decoded });
}
