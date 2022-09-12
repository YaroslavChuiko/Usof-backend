import prisma from '../../../lib/prisma';

// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient();

// async function main() {
//   // ... you will write your Prisma Client queries here
//   const allUsers = await prisma.cards.findMany();
//   console.log(allUsers);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async e => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

// /api/posts
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // getlist getMany getManyReference
    // /api/posts?_end=10&_order=ASC&_sort=id&_start=0
    handleGET(req, res);
  } else if (req.method === 'POST') {
    // Create a record
    handlePOST(req.body, res);
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

function getOptions(queryParams) {
  const options = {};
  options.include = { post_categories: { include: { category: true } } };
  const { _start, _end, _sort, _order, id, author_id, status, q, post_categories } = queryParams;
  console.log('queryParams Post', queryParams);

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
    console.log('idNum Post', idNum);

    options.where = {
      id: { in: idNum }, //??
    };
  } else if (author_id) {
    console.log('filterPOst author_id', author_id);
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
  // console.log(options);

  try {
    let posts = await prisma.post.findMany(options);
    posts = posts.map(post => {
      return { ...post, post_categories: post.post_categories.map(category => category.category.id) };
    });
    // console.log('posts', posts[0].post_categories)
    const countPosts = await prisma.post.count({ where: options.where });

    res.setHeader('X-Total-Count', countPosts);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// POST /api/posts
async function handlePOST(data, res) {
  const { author_id, title, content, status, post_categories } = data;
  // console.log(data);

  try {
    const newPost = await prisma.post.create({
      data: {
        author_id: author_id,
        title: title,
        content: content,
        status: status,
        post_categories: {
          createMany: { data: post_categories.map(item => ({ category_id: item })) }, // create row for every category in join table
        },
      },
    });
    res.status(200).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}
