import prisma from '../../../lib/prisma';

// /api/users/[userId]
export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    handleGET(userId, res); // getOne
  } else if (req.method === 'PUT') {
    console.log('PUT', req.body);
    handlePUT(userId, req.body, res); // Create a record
  } else if (req.method === 'DELETE') {
    handleDELETE(userId, res); // delete
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/users/[userId]
async function handleGET(userId, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// PUT /api/users/[userId]
async function handlePUT(userId, data, res) {
  const {login, password, full_name, email, profile_picture, role } = data;
  try {
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        login: login,
        password: password,
        full_name: full_name,
        email: email,
        // profile_picture: profile_picture,
        role: role,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// DELETE /api/users/[userId]
async function handleDELETE(userId, res) {
  try {
    const user = await prisma.user.delete({
      where: { id: Number(userId) },
    });

    res.status(200).json(user);
    // {
    //     data: { id: 123, title: "hello, world" }
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}
