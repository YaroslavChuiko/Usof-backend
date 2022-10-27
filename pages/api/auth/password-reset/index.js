import prisma from '../../../../lib/prisma';
import { generateUniqueToken } from '../../../../util/auth';
import { sendEmailPasswordReset } from '../../../../util/sendEmail';

// /api/auth/password-reset - send a password reset link to user email
export default async function handler(req, res) {
  if (req.method === 'POST') {
    handlePOST(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

//POST /api/auth/password-reset
async function handlePOST(req, res) {
  const { email } = req.body;
  console.log(email);

  const result = {
    success: true,
    message: '',
  };

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      result.success = false;
      result.message = 'There is no user with that email';
      return res.status(200).json(result);
    }

    const token = generateUniqueToken();
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
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

    await sendEmailPasswordReset(token, email);
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
