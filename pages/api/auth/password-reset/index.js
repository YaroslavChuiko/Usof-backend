import prisma from '../../../../lib/prisma';
import { generateToken, withAuthUser } from '../../../../util/auth';
import { TYPE_ERROR, TYPE_SUCCESS } from '../../../../util/const';
import { sendEmailPasswordReset } from '../../../../util/sendEmail';

// /api/auth/password-reset - send a password reset link to user email
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

//POST /api/users/verify
async function handlePOST(req, res) {
  const userData = req.user;
  console.log(userData);
  const result = {
    success: true,
    message: '',
  };

  try {
    const userPasswordToken = await prisma.password_token.findUnique({
      where: {
        user_id: Number(userData.id),
      },
    });

    if (userPasswordToken) {
      result.success = true;
      result.message = 'The reset password link has been already sent to your email address';
      return res.status(200).json(result);
    }

    const token = generateToken();
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userData.id),
      },
      data: {
        password_token: {
          upsert: {
            create: { token: token },
            update: { token: token },
          },
        },
      },
    });

    await sendEmailPasswordReset(token, userData.email);
    result.success = true;
    result.message = 'The reset password link has been sent to your email address';
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    result.success = false;
    result.message = 'Something goes wrong. Please try again';

    res.status(500).json(result);
  }
}
