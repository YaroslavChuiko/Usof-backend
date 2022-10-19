import prisma from '../../../../lib/prisma';
import SimpleCRUD from '../../../../logic/SimpleCRUD';
import { withAuthUser } from '../../../../util/auth';

// /api/answers/[answerId]
export default async function handler(req, res) {
  const { answerId } = req.query;

  if (req.method === 'GET') {
    handleGET(res, answerId);
  } else if (req.method === 'PUT') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handlePUT(req, res, answerId);
  } else if (req.method === 'DELETE') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handleDELETE(req, res, answerId);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/answers/[answerId]
async function handleGET(res, answerId) {
  try {
    const answer = await SimpleCRUD.getOne(answerId, prisma.answer);

    res.status(200).json(answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// PUT /api/answers/[answerId]
async function handlePUT(req, res, answerId) {
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
    const answer = await SimpleCRUD.update(answerId, dataToUpdate, prisma.answer);

    res.status(200).json(answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// DELETE /api/answers/[answerId]
async function handleDELETE(req, res, answerId) {
  try {
    if (req.user.role === 'user') {
      const answer = await SimpleCRUD.getOne(answerId, prisma.answer);

      if (req.user.id != answer.author_id) {
        return res.status(403).json({ message: "You don't have enough access rights" });
      }
    }

    const answer = await SimpleCRUD.delete(answerId, prisma.answer);

    res.status(200).json(answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
