class SimpleCRUD {
  constructor() {}

  // GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24&title=bar
  static async getList(options, prismaModelEntity) {
    const entities = await prismaModelEntity.findMany(options);
    const countEntities = await prismaModelEntity.count({ where: options.where });

    return [entities, countEntities];
  }

  // GET http://my.api.url/posts/123
  static async getOne(id, prismaModelEntity) {
    const entity = await prismaModelEntity.findUnique({
      where: {
        id: Number(id),
      },
    });

    return entity;
  }

  // POST http://my.api.url/posts
  static async create(data, prismaModelEntity) {
    const entity = await prismaModelEntity.create({
      data: { ...data },
    });

    return entity;
  }

  // PUT http://my.api.url/posts/123
  static async update(id, data, prismaModelEntity) {
    const entity = await prismaModelEntity.update({
      where: { id: Number(id) },
      data: { ...data },
    });

    return entity;
  }

  // DELETE http://my.api.url/posts/123
  static async delete(id, prismaModelEntity) {
    const entity = await prismaModelEntity.delete({
      where: { id: Number(id) },
    });
    
    return entity;
  }
}

export default SimpleCRUD;
