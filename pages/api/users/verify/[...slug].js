import prisma from '../../../../lib/prisma';
import { TYPE_ERROR } from '../../../../util/const';

// /api/users/verify/[userId]/[token] - verify user email with token
export default async function handler(req, res) {
  if (req.method === 'POST') {
    handlePOST(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// POST /api/users/verify/[userId]/[token]
async function handlePOST(req, res) {
  // const cookies = new Cookies(req, res);
  //? mb get userId from jwt token instead url
  const { slug } = req.query;
  const [userId, token] = slug;
  const result = {
    type: '',
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
      result.type = TYPE_ERROR;
      result.message = 'Invalid link, please try again';
      return res.status(200).json(result);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        active: true,
        email_token: {
          delete: true, // Update an existing User record by deleting the token record it's connected to
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

    result.type = TYPE_ERROR;
    result.message = 'Your email verified sucessfully!';
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    result.type = TYPE_ERROR;
    result.message = 'Something goes wrong. Please try again';
    res.status(500).json(result);
  }
}
