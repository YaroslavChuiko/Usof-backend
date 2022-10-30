import Cookies from 'cookies';
import prisma from '../../../../lib/prisma';
import { generateAccessToken, withAuthUser } from '../../../../util/auth';
import { TOKEN_EXPIRE_SEC } from '../../../../util/const';

// /api/auth/email-verify/[token] - verify user email with token
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handlePOST(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// POST /api/auth/email-verify/[token]
async function handlePOST(req, res) {
  const cookies = new Cookies(req, res);
  const { token } = req.query;
  const userId = req.user.id;
  const result = {
    success: true,
    message: '',
  };

  try {
    const userToken = await prisma.email_token.findFirst({
      where: {
        user_id: Number(userId),
        token: token,
      },
    });

    if (!userToken) {
      result.success = false;
      result.message = 'Invalid link, please try again';
      return res.status(200).json(result);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        email_verified: true,
        email_token: {
          delete: true, // Update an existing User record by deleting the token record it's connected to
        },
      },
    });

    const userData = {
      id: updatedUser.id,
      login: updatedUser.login,
      fullName: updatedUser.full_name,
      email: updatedUser.email,
      emailVerified: updatedUser.email_verified,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      rating: updatedUser.rating,
    };

    //refresh token
    const newToken = generateAccessToken(userData);
    cookies.set('token', newToken, {
      sameSite: 'lax',
      maxAge: TOKEN_EXPIRE_SEC * 1000,
      httpOnly: true,
    });

    result.success = true;
    result.message = 'Your email verified sucessfully!';
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    result.success = false;
    result.message = 'Something goes wrong. Please try again';
    res.status(500).json(result);
  }
}
