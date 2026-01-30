import { UserRepository, CreateUserInput } from '../../repositories/user.repository';
import {
  pbkdf2HashPassword,
  verifyPassword
} from '../../utils/password';

export class QunUserService {
  private repo = new UserRepository();

  async register(input: {
    username?: string;
    mobilePhoneNumber?: string;
    email?: string;
    password: string;
    nickName: string;
  }) {
    // 新注册用户使用 pbkdf2 加密
    const { hash, salt } = pbkdf2HashPassword(input.password);
    const userInput: CreateUserInput = {
      username: input.username,
      mobile_phone_number: input.mobilePhoneNumber,
      email: input.email,
      password_hash: hash,
      salt,
      nick_name: input.nickName
      // lc_object_id 为 undefined，表示新用户
    };
    const user = this.repo.create(userInput);
    return user;
  }

  async login(usernameOrMobile: string, password: string) {
    const user = this.repo.findByUsernameOrMobile(usernameOrMobile);
    if (!user) return null;

    // 如果密码是 pbkdf2 生成的 64 位 hex，则优先按新算法验证
    const isPbkdf2Style = /^[0-9a-f]{64}$/i.test(user.password_hash);

    // 只有在仍然是 LeanCloud 风格密码时，才按 LeanCloud 算法验证
    const isLeanCloudUser = !!user.lc_object_id && !isPbkdf2Style;

    // 使用对应的加密算法验证密码
    const isValid = verifyPassword(
      password,
      user.password_hash,
      user.salt,
      isLeanCloudUser
    );

    if (!isValid) return null;
    return user;
  }

  async updatePassword(userId: number, newPassword: string) {
    // 修改密码时统一使用新的 pbkdf2 算法
    const { hash, salt } = pbkdf2HashPassword(newPassword);
    this.repo.updatePassword(userId, hash, salt);
  }
}


