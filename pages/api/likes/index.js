import prisma from '../../../lib/prisma';

// /api/likes
export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else if (req.method === 'POST') {
    handlePOST(req.body, res);
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

function getOptions(queryParams) {
  const options = {};
  const { _start, _end, _sort, _order, id, author_id, target_post, target_comment, type} = queryParams;
  console.log('queryParams like', queryParams);
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
    // console.log(id);
    let idNum = Array.isArray(id) ? id.map(item => Number(item)) : [Number(id)];
    console.log('idNum like', idNum);

    options.where = {
      id: { in: idNum }, //??
    };
  } else if (author_id) {
    console.log('filterlike author_id', author_id);
    // getManyReference
    options.where = {
      author_id: {
        equals: Number(author_id),
      },
    };
  } else if (target_post) {
    console.log('filterlike target_post', target_post);
    // getManyReference
    options.where = {
      target_post: {
        equals: Number(target_post),
      },
    };
  } else if (target_comment) {
    console.log('filterlike target_comment', target_comment);
    // getManyReference
    options.where = {
      target_comment: {
        equals: Number(target_comment),
      },
    };
  } else if (type) {
    options.where = {
      type: {
        equals: type,
      },
    };
  }

  return options;
}

// GET /api/likes/[likeId]
async function handleGET(req, res) {
  const options = getOptions(req.query);
  // console.log(options);

  try {
    const likes = await prisma.like_entity.findMany(options);
    const countLikes = await prisma.like_entity.count({ where: options.where });

    res.setHeader('X-Total-Count', countLikes);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(likes);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// POST /api/likes/[likeId]
// async function handlePOST(data, res) {
//   const { author_id, post_id, content, status } = data;
//   // console.log(data);

//   try {
//     const newlike = await prisma.like_entity.create({
//       data: {
//         author_id: author_id,
//         post_id: post_id,
//         content: content,
//         status: status,
//       },
//     });
//     res.status(200).json(newlike);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error.message);
//   }
// }
