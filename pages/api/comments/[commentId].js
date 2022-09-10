import prisma from '../../../lib/prisma';

// /api/comments/[commentId]
export default async function handler(req, res) {
  const { commentId } = req.query;

  if (req.method === 'GET') {
    handleGET(commentId, res); // getOne
  } else if (req.method === 'PUT') {
    console.log('PUT', req.body);
    handlePUT(commentId, req.body, res); // Create a record
  } else if (req.method === 'DELETE') {
    handleDELETE(commentId, res); // delete
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/comments/[commentId]
async function handleGET(commentId, res) {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(commentId),
      },
    });

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// PUT /api/comments/[commentId]
async function handlePUT(commentId, data, res) {
  const { author_id, post_id, content, status} = data;
  try {
    const comment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: {
        author_id: author_id,
        post_id: post_id,
        content: content,
        status: status,
      },
    });
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// DELETE /api/comments/[commentId]
async function handleDELETE(commentId, res) {
  try {
    const comment = await prisma.comment.delete({
      where: { id: Number(commentId) },
    });

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}
