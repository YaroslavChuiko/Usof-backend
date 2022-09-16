import Cookies from 'cookies';
import crypto from 'crypto';
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function handleGET(req, res) {
  // const cookies = new Cookies(req, res);
  const { slug } = req.query;
  const [userId, token] = slug;

  try {
    const userToken = await prisma.token.findFirst({
      where: {
        user_id: Number(userId),
        token: token,
      }
    });

    if (!userToken) return res.status(400).send("Invalid link");

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        active: true,
        token: {
          delete: true, // Update an existing User record by deleting the token record it's connected to // Delete all tokens belonging to a specific user as part of an update
        },
      },
    });

    console.log(updatedUser);

    // ! after activate email update jwt token payload active to true
    // const token = generateAccessToken(tokenPayload);

    // cookies.set('token', token, {
    //   sameSite: 'lax',
    //   maxAge: TOKEN_EXPIRE_SEC * 1000,
    // });

    res.status(200).send('Your email verified sucessfully!');
  } catch (error) {
    console.log(error);
    res.status(400).send('An error occured');
  }
}
