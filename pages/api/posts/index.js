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

function getOprions(queryParams) {
  const options = {};
  const { _start, _end, _sort, _order, id, login } = queryParams;

  if (_start && _end) {
    options.skip = Number(_start);
    options.take = _end - _start;
  }
  if (_sort && _order) {
    options.orderBy = {
      [_sort]: _order.toLowerCase(),
    }
  }
  if (id) {
    options.where = {
      id: {in: id} //??
    }
  }else if (login) {
    options.where = {
      login: {
        equals: login,
      }
    }
  }

  return options;
}

async function handleGET(req, res) {
  const options = getOprions(req.query);
  let posts;
  let countPosts;

  try {
    posts = await prisma.post.findMany(options);
    countPosts = await prisma.post.count({where: options.where});

    res.setHeader('X-Total-Count', countPosts);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// /api/posts
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // getlist getMany getManyReference
    // /api/posts?_end=10&_order=ASC&_sort=id&_start=0
    handleGET(req,res);
   
  }else if (req.method === 'POST') {
    // Create a record
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}
