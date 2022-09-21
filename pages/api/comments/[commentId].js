import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';

// /api/comments/[commentId]
export default async function handler(req, res) {
  const { commentId } = req.query;

  if (req.method === 'GET') {
    handleGET(res, commentId);
  } else if (req.method === 'PUT') {
    console.log('PUT', req.body);
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handlePUT(req, res, commentId);
  } else if (req.method === 'DELETE') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handleDELETE(req, res, commentId);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/comments/[commentId]
async function handleGET(res, commentId) {
  try {
    const comment = await SimpleCRUD.getOne(commentId, prisma.comment);

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// PUT /api/comments/[commentId]
async function handlePUT(req, res, commentId) {
  const { author_id, post_id, content, status } = req.body;

  if (req.user.role === 'user' && req.user.id != author_id) {
    return res.status(403).json({ message: "You don't have enough access rights" });
  }

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
async function handleDELETE(req, res, commentId) {
  try {
    if (req.user.role === 'user') {
      const comment = await SimpleCRUD.getOne(commentId, prisma.comment);

      if (req.user.id != comment.author_id) {
        return res.status(403).json({ message: "You don't have enough access rights" });
      }
    }

    const comment = await SimpleCRUD.delete(commentId, prisma.comment);

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
