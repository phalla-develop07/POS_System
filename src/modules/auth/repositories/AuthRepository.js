const { BaseRepository } = require('../../../core/base/BaseRepository');
const { UserSchema } = require('../models/User');

class AuthRepository extends BaseRepository {
  constructor() {
    super(UserSchema);
  }

  findByEmail(email) {
    return this.repository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  createUser(userData) {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }
}

module.exports.AuthRepository = AuthRepository;
