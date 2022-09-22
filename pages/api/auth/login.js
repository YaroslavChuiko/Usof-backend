import Cookies from 'cookies';
import prisma from '../../../lib/prisma';
import { generateAccessToken } from '../../../util/auth';
import { TOKEN_EXPIRE_SEC } from '../../../util/const';
import { checkUser } from '../../../util/validation';

// /api/auth/login
export default async function handler(req, res) {
  if (req.method === 'POST') {
    login(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function login(req, res) {
  const cookies = new Cookies(req, res);
  const { login, password } = req.body;
  
  let user;
  let result = {
    success: true,
    message: '',
  };

  try {
    user = await prisma.user
      .findUnique({
        where: {
          login: login,
        },
      })
  } catch (error) {
    console.log(error)
    return res.status(500).json(error.message);
  }

  result = checkUser(user, password);

  if (result.success) {
    const userData = {
      id: user.id,
      login: user.login,
      fullName: user.full_name,
      email: user.email,
      active: user.active,
      avatar: user.profile_picture,
      role: user.role,
    };
    result.user = userData;
    const token = generateAccessToken(userData);

    cookies.set('token', token, {
      sameSite: 'lax',
      maxAge: TOKEN_EXPIRE_SEC * 1000,
      httpOnly: true,
    });
  }

  res.status(200).json(result);
}
