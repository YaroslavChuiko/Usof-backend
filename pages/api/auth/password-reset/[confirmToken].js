import bcrypt from 'bcrypt';
import prisma from '../../../../lib/prisma';
import { SAULT_ROUNDS } from '../../../../util/const';
import { validatePassword } from '../../../../util/validation';

// /api/auth/password-reset/[confirmToken]
export default async function handler(req, res) {
  if (req.method === 'POST') {
    handlePOST(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// POST /api/auth/password-reset/[confirmToken]
async function handlePOST(req, res) {
  const { confirmToken } = req.query;
  const { newPassword } = req.body;
  const result = {
    success: true,
    message: '',
  };

  try {
    const userToken = await prisma.password_token.findUnique({
      where: {
        token: confirmToken,
      },
    });

    if (!userToken) {
      result.success = false;
      result.message = 'Invalid link, please try again';
      return res.status(200).json(result);
    }

    const validationMessage = validatePassword(newPassword);
    if (validationMessage) {
      result.success = false;
      result.message = validationMessage;
      return res.status(400).json(result);
    }

    const hash = bcrypt.hashSync(newPassword, SAULT_ROUNDS);
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userToken.user_id),
      },
      data: {
        password: hash,
        password_token: {
          delete: true, // Update an existing User record by deleting the token record it's connected to
        },
      },
    });

    result.success = true;
    result.message = 'Your password has been reset successfully!';
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    result.success = false;
    result.message = 'Something goes wrong. Please try again';
    res.status(500).json(result);
  }
}
