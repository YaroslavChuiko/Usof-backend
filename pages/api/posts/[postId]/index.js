import prisma from '../../../../lib/prisma';
import SimpleCRUD from '../../../../logic/SimpleCRUD';
import { withAuthUser } from '../../../../util/auth';

// /api/posts/[postid]
export default async function handler(req, res) {
  let { postId } = req.query;
  postId = Number(postId);

  if (req.method === 'GET') {
    handleGET(postId, res);
  } else if (req.method === 'PUT') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handlePUT(req, res, postId);
  } else if (req.method === 'DELETE') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handleDELETE(req, res, postId);
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

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// PUT /api/posts/[postid]
async function handlePUT(req, res, postId) {
  const { author_id, status, title, content, post_categories } = req.body;

  if (req.user.role === 'user' && req.user.id != author_id) {
    return res.status(403).json({ message: "You don't have enough access rights" });
  }

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

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// DELETE /api/posts/[postid]
async function handleDELETE(req, res, postId) {
  try {
    if (req.user.role === 'user') {
      const post = await SimpleCRUD.getOne(postId, prisma.post);

      if (req.user.id != post.author_id) {
        return res.status(403).json({ message: "You don't have enough access rights" });
      }
    }

    const deletedPost = await SimpleCRUD.delete(postId, prisma.post);

    res.status(200).json(deletedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
