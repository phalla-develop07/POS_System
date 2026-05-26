const { AppDataSource } = require('../../database/data-source');

class BaseRepository {
  constructor(entity) {
    this.repository = AppDataSource.getRepository(entity);
  }

  findAll() {
    return this.repository.find();
  }

  findById(id) {
    return this.repository.findOneBy({ id });
  }

  save(entity) {
    return this.repository.save(this.repository.create(entity));
  }
}

module.exports.BaseRepository = BaseRepository;
