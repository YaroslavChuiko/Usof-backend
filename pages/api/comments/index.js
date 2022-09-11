import prisma from '../../../lib/prisma';

// /api/comments
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
  const { _start, _end, _sort, _order, id, author_id, post_id, status, q } = queryParams;
  console.log('queryParams comment', queryParams);
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
    console.log('idNum comment', idNum);

    options.where = {
      id: { in: idNum }, //??
    };
  } else if (author_id) {
    console.log('filterComment author_id', author_id);
    // getManyReference
    options.where = {
      author_id: {
        equals: Number(author_id),
      },
    };
  } else if (post_id) {
    console.log('filterComment post_id', post_id);
    // getManyReference
    options.where = {
      post_id: {
        equals: Number(post_id),
      },
    };
  } else if (status) {
    options.where = {
      status: {
        equals: status,
      },
    };
  } else if (q) {
    options.where = {
      content: { contains: q },
    };
  }

  return options;
}

// GET /api/comments/
async function handleGET(req, res) {
  const options = getOptions(req.query);
  // console.log(options);

  try {
    const comments = await prisma.comment.findMany(options);
    const countComments = await prisma.comment.count({ where: options.where });

    res.setHeader('X-Total-Count', countComments);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

// POST /api/comments/
async function handlePOST(data, res) {
  const { author_id, post_id, content, status } = data;
  // console.log(data);

  try {
    const newComment = await prisma.comment.create({
      data: {
        author_id: author_id,
        post_id: post_id,
        content: content,
        status: status,
      },
    });
    res.status(200).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}
