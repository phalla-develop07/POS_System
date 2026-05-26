import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntityModel } from '../../../core/base/BaseEntity';
import { Role } from './Role.entity';

@Entity('users')
export class User extends BaseEntityModel {
  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ name: 'is_active', type: 'tinyint', default: true })
  isActive!: boolean;

  @ManyToOne(() => Role, {
    eager: true,
    nullable: false
  })
  @JoinColumn({ name: 'role_id' })
  role!: Role;
}
