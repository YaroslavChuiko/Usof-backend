import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';
import { generateToken } from '../../../util/auth';
import { SAULT_ROUNDS } from '../../../util/const';
import { sendEmailVerify } from '../../../util/sendEmail';

// /api/users
export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else if (req.method === 'POST') {
    handlePOST(req.body, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

function getOptions(queryParams) {
  const options = {};
  const { _start, _end, _sort, _order, id, login, role, q } = queryParams;
  console.log('queryParams User', queryParams);
  if (_start && _end) {
    options.skip = Number(_start);
    options.take = _end - _start;
  }
  if (_sort && _order) {
    options.orderBy = {
      [_sort]: _order.toLowerCase(),
    };
  }
  if (id) {
    let idNum = Array.isArray(id) ? id.map(item => Number(item)) : [Number(id)];
    console.log('idNum User', idNum);

    options.where = {
      id: { in: idNum }, //??
    };
  } else if (login) {
    console.log('filterUsers login', login);

    options.where = {
      login: {
        equals: login,
      },
    };
  } else if (role) {
    options.where = {
      role: {
        equals: role,
      },
    };
  } else if (q) {
    options.where = {
      OR: [
        {
          login: { contains: q },
        },
        {
          full_name: { contains: q },
        },
      ],
    };
  }

  return options;
}

// GET /api/users/
async function handleGET(req, res) {
  const options = getOptions(req.query);

  try {
    const [users, countUsers] = await SimpleCRUD.getList(options, prisma.user);

    res.setHeader('X-Total-Count', countUsers);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// POST /api/users/
async function handlePOST(data, res) {
  const { login, password, full_name, email, profile_picture, role } = data;
  const hash = bcrypt.hashSync(password, SAULT_ROUNDS);
  const token = generateToken();
  const newUserData = {
    login,
    password: hash,
    full_name,
    email,
    profile_picture,
    role,
    email_token: {
      create: { token: token },
    },
  };

  try {
    const newUser = await SimpleCRUD.create(newUserData, prisma.user);
    await sendEmailVerify(newUser.id, token, newUser.email);

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
