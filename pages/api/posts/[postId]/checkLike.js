import prisma from '../../../../lib/prisma';
import { withAuthUser } from '../../../../util/auth';

// /api/posts/[postid]/checkLike
export default async function handler(req, res) {
  let { postId } = req.query;
  postId = Number(postId);

  if (req.method === 'GET') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handleGET(req, res, postId);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/posts/[postid]/checkLike
async function handleGET(req, res, postId) {
  const currentUserId = req.user.id;

  try {
    let like = await prisma.like_entity.findUnique({
      where: {
        author_id_target_post:{
          author_id: Number(currentUserId),
          target_post: Number(postId),
        }
      },
    });

    res.status(200).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
