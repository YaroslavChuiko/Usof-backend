import prisma from '../../../lib/prisma';
import { checkUnique, validateData } from '../../../logic/validation';
import { TYPE_SUCCESS } from '../../../util/const';

// /api/auth/register
export default async function handler(req, res) {
  if (req.method === 'POST') {
    handlePOST(res, req.body);
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function handlePOST(res, data) {
  let result;

  try {
    result = await validate(data);
    if (result.type === TYPE_SUCCESS) {
      //check email is real
      // create user
      const { login, password, firstName, lastName, email } = data;
  
      await prisma.user.create({
        data: {
          login,
          password,
          full_name: `${firstName} ${lastName}`,
          email,
          profile_picture: 'test.png',
          role: 'user',
        }
      });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function validate(data) {
  let result = validateData(data);

  try {
    if (result.type === TYPE_SUCCESS) {
      result = await checkUnique(data);
    }
  } catch (error) {
    throw error;
  }
  // approve email

  return result;
}



