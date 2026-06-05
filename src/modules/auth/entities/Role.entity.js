const {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} = require('typeorm');

class Role {}

Entity('roles')(Role);
PrimaryGeneratedColumn()(Role.prototype, 'id');
Column({ type: 'varchar', length: 50, unique: true })(Role.prototype, 'name');
Column({ type: 'varchar', length: 255, nullable: true })(Role.prototype, 'description');
CreateDateColumn({ name: 'created_at' })(Role.prototype, 'createdAt');
UpdateDateColumn({ name: 'updated_at' })(Role.prototype, 'updatedAt');

module.exports.Role = Role;
