import crypto from 'node:crypto';
import { UserRepository, CreateUserInput } from '../../repositories/user.repository';

export class QunUserService {
  private repo = new UserRepository();

  private hashPassword(password: string, salt?: string) {
    const realSalt = salt ?? crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, realSalt, 100_000, 32, 'sha256')
      .toString('hex');
    return { hash, salt: realSalt };
  }

  async register(input: {
    username?: string;
    mobilePhoneNumber?: string;
    email?: string;
    password: string;
    nickName: string;
  }) {
    const { hash, salt } = this.hashPassword(input.password);
    const userInput: CreateUserInput = {
      username: input.username,
      mobile_phone_number: input.mobilePhoneNumber,
      email: input.email,
      password_hash: hash,
      salt,
      nick_name: input.nickName
    };
    const user = this.repo.create(userInput);
    return user;
  }

  async login(usernameOrMobile: string, password: string) {
    const user = this.repo.findByUsernameOrMobile(usernameOrMobile);
    if (!user) return null;
    const { hash } = this.hashPassword(password, user.salt ?? undefined);
    if (hash !== user.password_hash) return null;
    return user;
  }

  async updatePassword(userId: number, newPassword: string) {
    const { hash, salt } = this.hashPassword(newPassword);
    this.repo.updatePassword(userId, hash, salt);
  }
}


