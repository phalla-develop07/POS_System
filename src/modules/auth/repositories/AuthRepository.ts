import { BaseRepository } from '../../../core/base/BaseRepository';
import { UserSchema, type User } from '../models/User';

export class AuthRepository extends BaseRepository<User> {
  constructor() {
    super(UserSchema);
  }

  findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  createUser(userData: Partial<User>) {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }
}
