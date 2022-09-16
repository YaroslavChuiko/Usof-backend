import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { checkUnique, validateData } from '../../../util/validation';
import { SAULT_ROUNDS, TYPE_SUCCESS } from '../../../util/const';
import SimpleCRUD from '../../../logic/SimpleCRUD';

// /api/auth/register
export default async function handler(req, res) {
  if (req.method === 'POST') {
    handlePOST(res, req.body);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
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
      const hash = bcrypt.hashSync(password, SAULT_ROUNDS);
      const newUserData = {
        login,
        password: hash,
        full_name: `${firstName} ${lastName}`,
        email,
        profile_picture: 'test.png',
        role: 'user',
      };
      const newUser = await SimpleCRUD.create(newUserData, prisma.user)
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



