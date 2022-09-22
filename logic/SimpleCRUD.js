class SimpleCRUD {
  constructor() {}

  static async getList(options, prismaModelEntity) {
    const entities = await prismaModelEntity.findMany(options);
    const countEntities = await prismaModelEntity.count({ where: options.where });

    return [entities, countEntities];
  }

  static async getOne(id, prismaModelEntity) {
    const entity = await prismaModelEntity.findUnique({
      where: {
        id: Number(id),
      },
    });

    return entity;
  }

  static async create(data, prismaModelEntity) {
    const entity = await prismaModelEntity.create({
      data: { ...data },
    });

    return entity;
  }

  static async update(id, data, prismaModelEntity) {
    const entity = await prismaModelEntity.update({
      where: { id: Number(id) },
      data: { ...data },
    });

    return entity;
  }

  static async delete(id, prismaModelEntity) {
    const entity = await prismaModelEntity.delete({
      where: { id: Number(id) },
    });
    
    return entity;
  }
}

export default SimpleCRUD;
