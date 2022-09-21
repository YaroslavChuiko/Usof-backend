import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';
import { withAuthUser } from '../../../util/auth';

// /api/likes/[likeId]
export default async function handler(req, res) {
  const { likeId } = req.query;

  if (req.method === 'GET') {
    // handleGET(likeId, res); // getOne
  } else if (req.method === 'PUT') {
    // console.log('PUT', req.body);
  } else if (req.method === 'DELETE') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handleDELETE(likeId, res); // delete
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/likes/[likeId]
// async function handleGET(likeId, res) {
//   try {
//     const like = await prisma.like_entity.findUnique({
//       where: {
//         id: Number(likeId),
//       },
//     });

//     res.status(200).json(like);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error.message);
//   }
// }

// PUT /api/likes/[likeId]
// async function handlePUT(likeId, data, res) {
//   const { author_id, post_id, content, status} = data;
//   try {
//     const like = await prisma.like_entity.update({
//       where: { id: Number(likeId) },
//       data: {
//         author_id: author_id,
//         post_id: post_id,
//         content: content,
//         status: status,
//       },
//     });
//     res.status(200).json(like);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error.message);
//   }
// }

// DELETE /api/likes/[likeId]
async function handleDELETE(likeId, res) {
  try {
    const deletedLike = await SimpleCRUD.delete(likeId, prisma.like_entity);

    res.status(200).json(deletedLike);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
