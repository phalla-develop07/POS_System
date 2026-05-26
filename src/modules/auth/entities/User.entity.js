const { Column, Entity, JoinColumn, ManyToOne } = require('typeorm');
const { BaseEntityModel } = require('../../../core/base/BaseEntity');
const { Role } = require('./Role.entity');

module.exports.User = class User extends BaseEntityModel {
  constructor() {
    super();
  }
};

// Apply TypeORM decorators
const User = module.exports.User;

__decorate([
  Column({ type: 'varchar', length: 150, unique: true })
], User.prototype, 'email', void 0);

__decorate([
  Column({ name: 'password_hash', type: 'varchar', length: 255 })
], User.prototype, 'passwordHash', void 0);

__decorate([
  Column({ name: 'is_active', type: 'tinyint', default: true })
], User.prototype, 'isActive', void 0);

__decorate([
  ManyToOne(() => Role, { eager: true, nullable: false }),
  JoinColumn({ name: 'role_id' })
], User.prototype, 'role', void 0);

__decorate([
  Entity('users')
], User);

// Simple implementation
const typeorm = require('typeorm');
const EntityMetadataStorage = typeorm.getMetadataArgsStorage();

class User {
  constructor() {
    this.id = undefined;
    this.email = '';
    this.passwordHash = '';
    this.isActive = true;
    this.role = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

Reflect.decorate([typeorm.Entity('users')], User);
Reflect.decorate([typeorm.PrimaryGeneratedColumn()], User, 'id');
Reflect.decorate([typeorm.Column({ type: 'varchar', length: 150, unique: true })], User, 'email');
Reflect.decorate([typeorm.Column({ name: 'password_hash', type: 'varchar', length: 255 })], User, 'passwordHash');
Reflect.decorate([typeorm.Column({ name: 'is_active', type: 'tinyint', default: true })], User, 'isActive');
Reflect.decorate([typeorm.ManyToOne(() => Role, { eager: true, nullable: false }), typeorm.JoinColumn({ name: 'role_id' })], User, 'role');
Reflect.decorate([typeorm.CreateDateColumn({ name: 'created_at' })], User, 'createdAt');
Reflect.decorate([typeorm.UpdateDateColumn({ name: 'updated_at' })], User, 'updatedAt');

module.exports = { User };
