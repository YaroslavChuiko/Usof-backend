import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';
import { getUserData, withAuthUser } from '../../../util/auth';

// /api/answers
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const result = getUserData(req, res);
    req.user = result;

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

function getOptions(queryParams, user) {
  const options = {};
  options.where = { AND: [] };
  const { _start, _end, _sort, _order, id, author_id, post_id, status, q } = queryParams;

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
    let idNum = Array.isArray(id) ? id.map((item) => Number(item)) : [Number(id)];

    options.where.AND.push({
      id: { in: idNum },
    });
  }
  if (author_id) {
    options.where.AND.push({
      author_id: {
        equals: Number(author_id),
      },
    });
  }
  if (post_id) {
    options.where.AND.push({
      post_id: {
        equals: Number(post_id),
      },
    });
  }
  if (!user) {
    options.where.AND.push({
      status: {
        equals: 'active',
      },
    });
  }
  else if ( user?.role && status) { //add status
    options.where.AND.push({OR: [
      {
        status: {
          equals: status,
        },
      },
      {
        author_id: {
          equals: Number(user.id),
        },
      },
    ]});
  }
  else if (status) {
    options.where.AND.push({
      status: {
        equals: status,
      },
    });
  }
  if (q) {
    options.where.AND.push({
      content: { contains: q },
    });
  }

  return options;
}

// GET /api/answers/
async function handleGET(req, res) {
  const options = getOptions(req.query, req?.user);

  try {
    const [answers, countAnswers] = await SimpleCRUD.getList(options, prisma.answer);

    res.setHeader('X-Total-Count', countAnswers);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(answers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// POST /api/answers/
async function handlePOST(req, res) {
  const { author_id, post_id, content, status } = req.body;
  const newAnswerData = {
    author_id,
    post_id: Number(post_id),
    content,
    status,
  };

  try {
    const newAnswer = await SimpleCRUD.create(newAnswerData, prisma.answer);

    res.status(201).json(newAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
