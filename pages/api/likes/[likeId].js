import prisma from '../../../lib/prisma';

// /api/likes/[likeId]
export default async function handler(req, res) {
  const { likeId } = req.query;

  if (req.method === 'GET') {
    // handleGET(likeId, res); // getOne
  } else if (req.method === 'PUT') {
    console.log('PUT', req.body);
    // handlePUT(likeId, req.body, res); // Create a record
  } else if (req.method === 'DELETE') {
    handleDELETE(likeId, res); // delete
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
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
    const like = await prisma.like_entity.delete({
      where: { id: Number(likeId) },
    });

    res.status(200).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}
