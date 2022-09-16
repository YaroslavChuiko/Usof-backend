import Cookies from 'cookies';

// /api/auth/logout
export default async function handler(req, res) {
  if (req.method === 'POST') {
    logout(res, req);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function logout(res, req) {
  const cookies = new Cookies(req, res);
  cookies.set('token'); // Delete a cookie

  res.status(200).json({message: 'Success logout'});
}

