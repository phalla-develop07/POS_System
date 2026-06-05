import type { EntityTarget, Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';

export class BaseRepository<T = any> {
  repository: Repository<any>;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity as EntityTarget<any>);
  }

  findAll() {
    return this.repository.find();
  }

  findById(id: number) {
    return this.repository.findOneBy({ id } as any);
  }

  save(entity: Partial<T>) {
    return this.repository.save(this.repository.create(entity as any) as any);
  }
}
