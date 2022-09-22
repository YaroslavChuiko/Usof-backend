import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';
import { withAuthUser } from '../../../util/auth';

// /api/posts
export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else if (req.method === 'POST') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handlePOST(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

function getOptions(queryParams) {
  const options = {};
  options.include = { post_categories: { include: { category: true } } };
  const { _start, _end, _sort, _order, id, author_id, status, q, post_categories } = queryParams;

  if (_start && _end) {
    options.skip = Number(_start);
    options.take = _end - _start;
  }
  if (_sort && _order) {
    options.orderBy = {
      [_sort]: _order.toLowerCase(),
    };
  }
  if (id) {
    let idNum = Array.isArray(id) ? id.map(item => Number(item)) : [Number(id)];
    options.where = {
      id: { in: idNum }, //??
    };
  } else if (author_id) {
    // getManyReference
    options.where = {
      author_id: {
        equals: Number(author_id),
      },
    };
  } else if (status) {
    options.where = {
      status: {
        equals: status,
      },
    };
  } else if (post_categories) {
    options.where = {
      post_categories: {
        some: {
          category_id: Number(post_categories),
        },
      },
    };
  } else if (q) {
    options.where = {
      OR: [
        {
          title: { contains: q },
        },
        // {
        //   status: { equals: q},
        // },
      ],
    };
  }

  return options;
}

// GET /api/posts
async function handleGET(req, res) {
  const options = getOptions(req.query);

  try {
    let posts = await prisma.post.findMany(options);
    posts = posts.map(post => {
      return { ...post, post_categories: post.post_categories.map(category => category.category.id) };
    });
    const countPosts = await prisma.post.count({ where: options.where });

    res.setHeader('X-Total-Count', countPosts);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// POST /api/posts
async function handlePOST(req, res) {
  const { author_id, title, content, status, post_categories } = req.body;

  if (req.user.role === 'user' && req.user.id != author_id) {
    return res.status(403).json({ message: "You don't have enough access rights" });
  }

  const newPostData = {
    author_id: author_id,
    title: title,
    content: content,
    status: status,
    post_categories: {
      createMany: { data: post_categories.map(item => ({ category_id: item })) }, // create row for every category in join table
    },
  };

  try {
    const newPost = await SimpleCRUD.create(newPostData, prisma.post);

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
