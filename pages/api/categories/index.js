import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';
import { withAuthAdmin } from '../../../util/auth';

// /api/categories
export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else if (req.method === 'POST') {
    const result = withAuthAdmin(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handlePOST(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

function getOptions(queryParams) {
  const options = {};
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
  } else if (post_id) {
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
      title: { contains: q },
    };
  }

  return options;
}

// GET /api/categories/
async function handleGET(req, res) {
  const options = getOptions(req.query);

  try {
    const [categories, countCategories] = await SimpleCRUD.getList(options, prisma.category);

    res.setHeader('X-Total-Count', countCategories);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// POST /api/categories/
async function handlePOST(req, res) {
  const { title, description } = req.body;
  const newCategoryData = {
    title,
    description,
  };

  try {
    const newCategory = await SimpleCRUD.create(newCategoryData, prisma.category);

    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
