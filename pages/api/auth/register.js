import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';
import { generateUniqueToken } from '../../../util/auth';
import { DEFAULT_AVATAR_PATH, SAULT_ROUNDS } from '../../../util/const';
import { sendEmailVerify } from '../../../util/sendEmail';
import { checkUnique, validateData } from '../../../util/validation';

// /api/auth/register
export default async function handler(req, res) {
  if (req.method === 'POST') {
    handlePOST(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function handlePOST(req, res) {
  const data = req.body;
  let result = {
    success: true,
    message: '',
  }

  try {
    result = await validate(data);

    if (result.success) {
      const { login, password, firstName, lastName, email } = data;
      const hash = bcrypt.hashSync(password, SAULT_ROUNDS);
      const token = generateUniqueToken();
      const newUserData = {
        login,
        password: hash,
        full_name: `${firstName} ${lastName}`,
        email,
        profile_picture: DEFAULT_AVATAR_PATH,
        role: 'user',
        email_token: {
          create: { token: token },
        },
      };
      const newUser = await SimpleCRUD.create(newUserData, prisma.user);
      await sendEmailVerify(newUser.id, token, newUser.email);
    }

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
}

async function validate(data) {
  let result = validateData(data);

  try {
    if (result.success) {
      result = await checkUnique(data);
    }
  } catch (error) {
    throw error;
  }

  return result;
}
