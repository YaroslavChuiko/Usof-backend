import prisma from '../../../../lib/prisma';
import { generateEmailVerifyToken, withAuthUser } from '../../../../util/auth';
import { TYPE_ERROR, TYPE_SUCCESS } from '../../../../util/const';
import { sendEmailVerify } from '../../../../util/sendEmail';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function handleGET(req, res) {
  const userData = withAuthUser(req, res);
  console.log(userData);
  const token = generateEmailVerifyToken();

  if (userData.active) return res.status(200).json({ type: TYPE_SUCCESS, message: 'You already verify your email' });

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userData.id),
      },
      data: {
        token: {
          upsert: {
            create: { token: token },
            update: { token: token },
          },
        },
      },
    });

    await sendEmailVerify(userData.id, token, userData.email);

    res.status(200).json({ type: TYPE_SUCCESS, message: 'Verification link sent to your email' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ type: TYPE_ERROR, message: 'An error occured' });
  }
}
