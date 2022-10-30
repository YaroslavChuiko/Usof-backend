import prisma from '../../../../lib/prisma';
import { generateUniqueToken, withAuthUser } from '../../../../util/auth';
import { sendEmailVerify } from '../../../../util/sendEmail';

// /api/auth/email-verify - send a verify link to user email
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

//POST /api/auth/email-verify
async function handlePOST(req, res) {
  const userData = req.user;
  
  const result = {
    success: true,
    message: '',
  };

  if (userData.email_verified) {
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

    const token = generateUniqueToken();

    await sendEmailVerify(token, userData.email);

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
