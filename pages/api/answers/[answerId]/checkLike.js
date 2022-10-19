import prisma from '../../../../lib/prisma';
import { withAuthUser } from '../../../../util/auth';

// /api/answers/[answerId]/checkLike
export default async function handler(req, res) {
  let { answerId } = req.query;
  answerId = Number(answerId);

  if (req.method === 'GET') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handleGET(req, res, answerId);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/answers/[answerId]/checkLike
async function handleGET(req, res, answerId) {
  const currentUserId = req.user.id;

  try {
    let like = await prisma.like_entity.findUnique({
      where: {
        author_id_target_answer:{
          author_id: Number(currentUserId),
          target_answer: Number(answerId),
        }
      },
    });

    res.status(200).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
