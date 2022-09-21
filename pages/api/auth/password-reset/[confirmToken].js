import bcrypt from 'bcrypt';
import prisma from '../../../../lib/prisma';
import { withAuthUser } from '../../../../util/auth';
import { SAULT_ROUNDS, TYPE_ERROR, TYPE_SUCCESS } from '../../../../util/const';

// /api/auth/password-reset/[confirmToken]
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

// POST /api/auth/password-reset/[confirmToken]
async function handlePOST(req, res) {
  const userData = req.user;
  const { confirmToken } = req.query;
  const { newPassword } = req.body;
  const result = {
    success: true,
    message: '',
  };

  try {
    const userToken = await prisma.password_token.findFirst({
      where: {
        user_id: Number(userData.id),
        token: confirmToken,
      },
    });

    if (!userToken) {
      result.success = false;
      result.message = 'Invalid link, please try again';
      return res.status(200).json(result);
    }

    //?? validate password
    const hash = bcrypt.hashSync(newPassword, SAULT_ROUNDS);
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userData.id),
      },
      data: {
        password: hash,
        password_token: {
          delete: true, // Update an existing User record by deleting the token record it's connected to
        },
      },
    });

    console.log(updatedUser);

    result.success = true;
    result.message = 'Your password has been updated successfully!';
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    result.success = false;
    result.message = 'Something goes wrong. Please try again';
    res.status(500).json(result);
  }
}
