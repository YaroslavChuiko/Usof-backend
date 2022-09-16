import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';
import { withAuthAdmin } from '../../../util/auth';

// /api/users/[userId]
export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    handleGET(userId, res); // getOne
  } else if (req.method === 'PUT') {
    console.log('PUT', req.body);
    handlePUT(userId, req.body, res); // Create a record
  } else if (req.method === 'DELETE') {
    handleDELETE(req, res, userId); // delete
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/users/[userId]
async function handleGET(userId, res) {
  try {
    const user = await SimpleCRUD.getOne(userId, prisma.user);

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Database error'});
  }
}

// PUT /api/users/[userId]
async function handlePUT(userId, data, res) {
  const { login, password, full_name, email, profile_picture, role } = data;
  const dataToUpdate = {
    login,
    password,
    full_name,
    email,
    profile_picture,
    role,
  };

  try {
    const updatedUser = await SimpleCRUD.update(userId, dataToUpdate, prisma.user);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Database error'});
  }
}

// DELETE /api/users/[userId]
async function handleDELETE(req, res, userId) {
  // const decoded = withAuthAdmin(req, res);
  // console.log(decoded);

  try {
    const deletedUser = await SimpleCRUD.delete(userId, prisma.user);

    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Database error'});
  }
}
