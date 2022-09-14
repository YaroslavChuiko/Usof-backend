import prisma from '../lib/prisma';

class SimpleREST {
  constructor() {}

  // GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24&title=bar
  static async getList(req, res, getOptions, prismaModelEntity) {
    const options = getOptions(req.query);

    try {
      const entities = await prismaModelEntity.findMany(options);
      const countEntities = await prismaModelEntity.count({ where: options.where });

      res.setHeader('X-Total-Count', countEntities);
      res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
      res.status(200).json(entities);
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  }

  // GET http://my.api.url/posts/123
  static async getOne(res, id, prismaModelEntity) {
    try {
      const entity = await prismaModelEntity.findUnique({
        where: {
          id: Number(id),
        },
      });

      res.status(200).json(entity);
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  }

  // GET http://my.api.url/posts?id=123&id=456&id=789
  // getMany() {}

  // // GET http://my.api.url/posts?author_id=345
  // getManyReference() {}

  // POST http://my.api.url/posts
  static async create(res, data, prismaModelEntity) {
    try {
      const entity = await prismaModelEntity.create({
        data: { ...data },
      });
      res.status(200).json(entity);
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  }

  // PUT http://my.api.url/posts/123
  static async update(res, id, data, prismaModelEntity) {
    try {
      const entity = await prismaModelEntity.update({
        where: { id: Number(id) },
        data: { ...data },
      });
      res.status(200).json(entity);
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  }

  // DELETE http://my.api.url/posts/123
  static async delete(res, id, prismaModelEntity) {
    try {
      const entity = await prismaModelEntity.delete({
        where: { id: Number(id) },
      });

      res.status(200).json(entity);
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  }
}

export default SimpleREST;
