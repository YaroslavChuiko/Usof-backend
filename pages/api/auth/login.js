import Cookies from 'cookies';
import prisma from '../../../lib/prisma';
import { checkUser } from '../../../util/validation';
import { generateAccessToken } from '../../../util/auth';
import { TOKEN_EXPIRE_SEC, TYPE_SUCCESS } from '../../../util/const';

// /api/auth/login
export default async function handler(req, res) {
  if (req.method === 'POST') {
    login(res, req);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function login(res, req) {
  const cookies = new Cookies(req, res);
  const { login, password } = req.body;
  let user;
  let result;

  try {
    user = await prisma.user
      .findUnique({
        where: {
          login: login,
        },
      })
      .catch(err => console.log(err));
  } catch (error) {
    res.status(500).json(error.message);
  }

  result = checkUser(user, password);

  if (result.type === TYPE_SUCCESS) {
    const tokenPayload = {
      login: user.login,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    };
    const token = generateAccessToken(tokenPayload);

    cookies.set('token', token, {
      sameSite: 'lax',
      maxAge: TOKEN_EXPIRE_SEC * 1000,
    });
  }

  res.status(200).json(result);
}
