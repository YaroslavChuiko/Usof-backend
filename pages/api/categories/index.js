import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';

// /api/categories
export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else if (req.method === 'POST') {
    handlePOST(req.body, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

function getOptions(queryParams) {
  const options = {};
  const { _start, _end, _sort, _order, id, author_id, post_id, status, q } = queryParams;
  console.log('queryParams category', queryParams);
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
    console.log('idNum category', idNum);

    options.where = {
      id: { in: idNum }, //??
    };
  } else if (author_id) {
    console.log('filtercategory author_id', author_id);
    // getManyReference
    options.where = {
      author_id: {
        equals: Number(author_id),
      },
    };
  } else if (post_id) {
    console.log('filtercategory post_id', post_id);
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
async function handlePOST(data, res) {
  const { title, description } = data;
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
