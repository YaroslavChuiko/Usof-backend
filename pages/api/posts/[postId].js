import prisma from '../../../lib/prisma';

// /api/posts/[postid]
export default async function handler(req, res) {
  let { postId } = req.query;
  postId = Number(postId);

  if (req.method === 'GET') {
    handleGET(postId, res); // getOne
  } else if (req.method === 'PUT') {
    // console.log('PUT', req.body);
    handlePUT(postId, req.body, res); // Create a record
  } else if (req.method === 'DELETE') {
    handleDELETE(postId, res); // delete
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
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
    console.log('get post ', post)

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// PUT /api/posts/[postid]
async function handlePUT(postId, data, res) {
  const { status, title, content, post_categories } = data;
  // console.log('Put post', data);
  try {
    await prisma.post_categories.deleteMany({
      where: {
          post_id: postId,

        // post_id_category_id: {
        //   post_id: postId,
        //   where:{
        //     category_id: {
        //       gte: 1,
        //     },
        //   }
        // }
      },
    });

    const post = await prisma.post.update({
      where: { id: Number(postId) },
      data: {
        status: status,
        title: title,
        content: content,
        post_categories: {
          createMany: { data: post_categories.map(item => ({  category_id: item })),}, // create row for every category in join table
        },
      },
      include: {post_categories: true}
    });
    console.log('Put post', post)
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// DELETE /api/posts/[postid]
async function handleDELETE(postId, res) {
  try {
    const post = await prisma.post.delete({
      where: { id: Number(postId) },
    });

    res.status(200).json(post);
    // {
    //     data: { id: 123, title: "hello, world" }
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}
