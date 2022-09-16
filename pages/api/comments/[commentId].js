import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';

// /api/comments/[commentId]
export default async function handler(req, res) {
  const { commentId } = req.query;

  if (req.method === 'GET') {
    handleGET(commentId, res);
  } else if (req.method === 'PUT') {
    console.log('PUT', req.body);
    handlePUT(commentId, req.body, res);
  } else if (req.method === 'DELETE') {
    handleDELETE(commentId, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/comments/[commentId]
async function handleGET(commentId, res) {
  try {
    const comment = await SimpleCRUD.getOne(commentId, prisma.comment);

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// PUT /api/comments/[commentId]
async function handlePUT(commentId, data, res) {
  const { author_id, post_id, content, status } = data;
  const dataToUpdate = {
    author_id,
    post_id,
    content,
    status,
  };

  try {
    const comment = await SimpleCRUD.update(commentId, dataToUpdate, prisma.comment);

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// DELETE /api/comments/[commentId]
async function handleDELETE(commentId, res) {
  try {
    const comment = await SimpleCRUD.delete(commentId, prisma.comment);

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
