import prisma from '../../../lib/prisma';

// /api/categories/[categoryId]
export default async function handler(req, res) {
  const { categoryId } = req.query;

  if (req.method === 'GET') {
    handleGET(categoryId, res); // getOne
  } else if (req.method === 'PUT') {
    console.log('PUT', req.body);
    handlePUT(categoryId, req.body, res); // Create a record
  } else if (req.method === 'DELETE') {
    handleDELETE(categoryId, res); // delete
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/categories/[categoryId]
async function handleGET(categoryId, res) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// PUT /api/categories/[categoryId]
async function handlePUT(categoryId, data, res) {
  const { title, description } = data;
  try {
    const category = await prisma.category.update({
      where: { id: Number(categoryId) },
      data: {
        title,
        description,
      },
    });
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// DELETE /api/categories/[categoryId]
async function handleDELETE(categoryId, res) {
  try {
    const category = await prisma.category.delete({
      where: { id: Number(categoryId) },
    });

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}
