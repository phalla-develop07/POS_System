const {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} = require('typeorm');
const { Role } = require('./Role.entity');

class User {}

Entity('users')(User);
PrimaryGeneratedColumn()(User.prototype, 'id');
Column({ type: 'varchar', length: 150, unique: true })(User.prototype, 'email');
Column({ name: 'password_hash', type: 'varchar', length: 255 })(User.prototype, 'passwordHash');
Column({ name: 'is_active', type: 'tinyint', default: true })(User.prototype, 'isActive');
ManyToOne(() => Role, { eager: true, nullable: false })(User.prototype, 'role');
JoinColumn({ name: 'role_id' })(User.prototype, 'role');
CreateDateColumn({ name: 'created_at' })(User.prototype, 'createdAt');
UpdateDateColumn({ name: 'updated_at' })(User.prototype, 'updatedAt');

module.exports.User = User;
