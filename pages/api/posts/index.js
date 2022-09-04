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

// /api/post
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get list
    // /api/posts?_end=10&_order=ASC&_sort=id&_start=0
    if (req.query._sort) {
      const { _start, _end, _sort, _order } = req.query;
      let allData;
      let count;

      console.log(req.query);
      // console.log(range);
      try {
        allData = await prisma.post.findMany({
          skip: +_start,
          take: _end - _start,
          orderBy: {
            [_sort]: _order.toLowerCase(),
          },
        });
        count = await prisma.post.count();

        res.setHeader('X-Total-Count', count);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
        // res.setHeader('Content-Range', `cards ${_start}-${_end}/${count}`);
      } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
      }

      res.status(200).json(allData);
    }
    // Get several records
    // /api/posts?filter={"id":[123,456,789]}
    if (req.query._filter) {
      // const { _filter} = req.query;
      // let allData;
      // let count;

      // console.log(req.query);
      // // console.log(range);
      // try {
      //   allData = await prisma.post.findMany({
      //     where: {
      //       []
      //     }
      //   });
      //   count = await prisma.post.count();

      //   res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
      //   res.setHeader('X-Total-Count', count);
      //   // res.setHeader('Content-Range', `cards ${_start}-${_end}/${count}`);
      // } catch (error) {
      //   console.error(error);
      //   res.status(500).json(error.message);
      // }

      // res.status(200).json(allData);
    }
  }

  if (req.method === 'POST') {
    // Create a record
  }
}
