import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';
import { withAuthUser } from '../../../util/auth';

// /api/likes
export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else if (req.method === 'POST') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handlePOST(req, res);
  } else if (req.method === 'DELETE') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handleDELETE(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

function getOptions(queryParams) {
  const options = {};
  const { _start, _end, _sort, _order, id, author_id, target_post, target_comment, type } = queryParams;
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

// GET /api/likes/
async function handleGET(req, res) {
  const options = getOptions(req.query);

  try {
    const [likes, countLikes] = await SimpleCRUD.getList(options, prisma.like_entity);

    res.setHeader('X-Total-Count', countLikes);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.status(200).json(likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// POST /api/likes
async function handlePOST(req, res) {
  const { author_id, target_post, target_comment, type } = req.body;

  if (req.user.id != author_id) {
    return res.status(403).json({ message: "You don't have enough access rights" });
  }

  const newLikeData = {
    author_id: author_id,
    target_post: target_post || null,
    target_comment: target_comment || null,
    type: type,
  };

  try {
    if (target_post && target_comment) {
      throw new Error('Only one of target_post or target_comment can be set');
    }

    if (author_id && target_post) {
      const newLike = await prisma.like_entity.upsert({
        where: {
          author_id_target_post: {
            author_id: author_id,
            target_post: target_post,
          },
        },
        create: { ...newLikeData },
        update: { type: type },
      });

      return res.status(200).json(newLike);
    }

    if (author_id && target_comment) {
      const newLike = await prisma.like_entity.upsert({
        where: {
          author_id_target_comment: {
            author_id: author_id,
            target_comment: target_comment,
          },
        },
        create: { ...newLikeData },
        update: { type: type },
      });

      return res.status(200).json(newLike);
    }

    throw new Error();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

// DELETE /api/likes
async function handleDELETE(req, res) {
  const { author_id, target_post, target_comment } = req.body;

  if (req.user.id != author_id) {
    return res.status(403).json({ message: "You don't have enough access rights" });
  }

  try {
    if (target_post && target_comment) {
      throw new Error('Only one of target_post or target_comment can be set');
    }

    if (author_id && target_post) {
      const deletedLike = await prisma.like_entity.delete({
        where: {
          author_id_target_post: {
            author_id: Number(author_id),
            target_post: Number(target_post),
          },
        },
      });

      return res.status(200).json(deletedLike);
    }

    if (author_id && target_comment) {
      const deletedLike = await prisma.like_entity.delete({
        where: {
          author_id_target_comment: {
            author_id: Number(author_id),
            target_comment: Number(target_comment),
          },
        },
      });

      return res.status(200).json(deletedLike);
    }

    throw new Error();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
