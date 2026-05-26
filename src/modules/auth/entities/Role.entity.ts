import { Column, Entity } from 'typeorm';
import { BaseEntityModel } from '../../../core/base/BaseEntity';

@Entity('roles')
export class Role extends BaseEntityModel {
  @Column({ type: 'varchar', length: 50, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;
}
