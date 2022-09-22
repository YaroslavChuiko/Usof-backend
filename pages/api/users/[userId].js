import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';
import { withAuthUser } from '../../../util/auth';
import { SAULT_ROUNDS } from '../../../util/const';

// /api/users/[userId]
export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    handleGET(userId, res);
  } else if (req.method === 'PUT') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handlePUT(req, res, userId); // Create a record
  } else if (req.method === 'DELETE') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

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
    res.status(500).json({ message: 'Database error' });
  }
}

// PUT /api/users/[userId]
async function handlePUT(req, res, userId) {
  if (req.user.role === 'user' && req.user.id != userId) {
    return res.status(403).json({ message: "You don't have enough access rights" });
  }

  const { login, password, full_name, email, profile_picture, role } = req.body;
  const hash = bcrypt.hashSync(password, SAULT_ROUNDS);

  const dataToUpdate = {
    login,
    password: hash,
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
    res.status(500).json({ message: 'Database error' });
  }
}

// DELETE /api/users/[userId]
async function handleDELETE(req, res, userId) {
  if (req.user.role === 'user' && req.user.id != userId) {
    return res.status(403).json({ message: "You don't have enough access rights" });
  }

  try {
    const deletedUser = await SimpleCRUD.delete(userId, prisma.user);

    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
