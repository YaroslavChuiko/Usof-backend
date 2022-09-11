import prisma from '../../../lib/prisma';

// /api/users
export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else if (req.method === 'POST') {
    handlePOST(req.body, res);
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

function getOptions(queryParams) {
  const options = {};
  const { _start, _end, _sort, _order, id, login, role, q } = queryParams;
  console.log('queryParams User', queryParams)
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
    // console.log(id);
    let idNum = Array.isArray(id) ? id.map(item => Number(item)) : [Number(id)];
    console.log('idNum User',idNum);

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
          login: { contains: q},
        },
        {
          full_name: { contains: q},
        }
      ]
    }
  }

  return options;
}

// GET /api/users/
async function handleGET(req, res) {
  const options = getOptions(req.query);
  // console.log(options);

  try {
    const users = await prisma.user.findMany(options);
    const countUsers = await prisma.user.count({ where: options.where });

    res.setHeader('X-Total-Count', countUsers);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// POST /api/users/
async function handlePOST(data, res) {
  const { login, password, full_name, email, profile_picture, role } = data;
  // console.log(data);

  try {
    const newUser = await prisma.user.create({
      data: {
        login: login,
        password: password,
        full_name: full_name,
        email: email,
        profile_picture: profile_picture,
        role: role,
      },
    });
    res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}