import prisma from '../../../../lib/prisma';
import { generateToken, withAuthUser } from '../../../../util/auth';
import { TYPE_ERROR, TYPE_SUCCESS } from '../../../../util/const';
import { sendEmailVerify } from '../../../../util/sendEmail';

// /api/users/verify - send a verify link to user email
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

  if (userData.active) {
    result.success = true;
    result.message = 'You already verify your email';
    return res.status(200).json(result);
  }

  try {
    const userEmailToken = await prisma.email_token.findUnique({
      where: {
        user_id: Number(userData.id),
      },
    });

    if (userEmailToken) {
      result.success = true;
      result.message = 'Verification link already sent to your email';

      return res.status(200).json(result);
    }

    const token = generateToken();
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userData.id),
      },
      data: {
        email_token: {
          upsert: {
            create: { token: token },
            update: { token: token },
          },
        },
      },
    });

    await sendEmailVerify(userData.id, token, userData.email);

    result.success = true;
    result.message = 'Verification link sent to your email';
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    result.success = false;
    result.message = 'Something goes wrong. Please try again';
    res.status(500).json(result);
  }
}
