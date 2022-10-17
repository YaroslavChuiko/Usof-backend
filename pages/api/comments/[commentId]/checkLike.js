import prisma from '../../../../lib/prisma';
import { withAuthUser } from '../../../../util/auth';

// /api/comments/[commentId]/checkLike
export default async function handler(req, res) {
  let { commentId } = req.query;
  commentId = Number(commentId);

  if (req.method === 'GET') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handleGET(req, res, commentId);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/comments/[commentId]/checkLike
async function handleGET(req, res, commentId) {
  const currentUserId = req.user.id;

  try {
    let like = await prisma.like_entity.findUnique({
      where: {
        author_id_target_comment:{
          author_id: Number(currentUserId),
          target_comment: Number(commentId),
        }
      },
    });

    res.status(200).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
