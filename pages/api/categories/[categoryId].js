import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';

// /api/categories/[categoryId]
export default async function handler(req, res) {
  const { categoryId } = req.query;

  if (req.method === 'GET') {
    handleGET(categoryId, res);
  } else if (req.method === 'PUT') {
    handlePUT(categoryId, req.body, res);
  } else if (req.method === 'DELETE') {
    handleDELETE(categoryId, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/categories/[categoryId]
async function handleGET(categoryId, res) {
  try {
    const category = await SimpleCRUD.getOne(categoryId, prisma.category);

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Database error'});
  }
}

// PUT /api/categories/[categoryId]
async function handlePUT(categoryId, data, res) {
  const { title, description } = data;
  const dataToUpdate = {
    title,
    description,
  };

  try {
    const category = await SimpleCRUD.update(categoryId, dataToUpdate, prisma.category);

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Database error'});
  }
}

// DELETE /api/categories/[categoryId]
async function handleDELETE(categoryId, res) {
  try {
    const category = await SimpleCRUD.delete(categoryId, prisma.category);

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Database error'});
  }
}
