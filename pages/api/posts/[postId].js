import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';

// /api/posts/[postid]
export default async function handler(req, res) {
  let { postId } = req.query;
  postId = Number(postId);

  if (req.method === 'GET') {
    handleGET(postId, res);
  } else if (req.method === 'PUT') {
    handlePUT(postId, req.body, res);
  } else if (req.method === 'DELETE') {
    handleDELETE(postId, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/posts/[postid]
async function handleGET(postId, res) {
  try {
    let post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
      include: { post_categories: { include: { category: true } } },
    });
    post = { ...post, post_categories: post.post_categories.map(category => category.category.id) };
    console.log('get post ', post);

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// PUT /api/posts/[postid]
async function handlePUT(postId, data, res) {
  const { status, title, content, post_categories } = data;

  try {
    // del all associations
    await prisma.post_categories.deleteMany({
      where: {
        post_id: postId,
      },
    });

    // create new associations
    const post = await prisma.post.update({
      where: { id: Number(postId) },
      data: {
        status: status,
        title: title,
        content: content,
        post_categories: {
          createMany: { data: post_categories.map(item => ({ category_id: item })) }, // create row for every category in join table
        },
      },
      include: { post_categories: true },
    });
    console.log('Put post', post);
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// DELETE /api/posts/[postid]
async function handleDELETE(postId, res) {
  try {
    const deletedPost = await SimpleCRUD.delete(postId, prisma.post);

    res.status(200).json(deletedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
