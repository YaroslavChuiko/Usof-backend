import prisma from '../../../lib/prisma';

// /api/posts/[postid]
export default async function handler(req, res) {
  const { postId } = req.query;

  if (req.method === 'GET') {
    handleGET(postId, res); // getOne
  } else if (req.method === 'PUT') {
    console.log('PUT', req.body);
    handlePUT(postId, req.body, res); // Create a record
  } else if (req.method === 'DELETE') {
    handleDELETE(postId, res); // delete
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function handleGET(postId, res) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

async function handlePUT(postId, data, res) {
  const { status, title, content } = data;
  try {
    const post = await prisma.post.update({
      where: { id: Number(postId) },
      data: {
        status: status,
        title: title,
        content: content,
      },
    });
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

async function handleDELETE(postId, res) {
  try {
    await prisma.post.delete({
      where: { id: Number(postId) },
    });

    res.status(200).json({});
    // {
    //     data: { id: 123, title: "hello, world" }
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}
