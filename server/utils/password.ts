import crypto from 'node:crypto';

/**
 * LeanCloud 密码加密算法
 * 根据 doc/_user.md 文档实现
 *
 * 算法步骤：
 * 1. 创建 SHA-512 加密算法 hasher
 * 2. 使用 salt 和 password（原始密码）调用 hasher.update
 * 3. 获取加密后的值 hv
 * 4. 重复 512 次调用 hasher.update(hv)，每次 hv 都更新为最新的 hasher.digest 加密值
 * 5. 最终的 hv 值做 base64 编码，保存为 password
 */
export function leancloudHashPassword(password: string, salt: string): string {
  const hasher = crypto.createHash('sha512');
  hasher.update(salt);
  hasher.update(password);
  let hv = hasher.digest();

  // 重复 512 次
  for (let i = 0; i < 512; i++) {
    const hash = crypto.createHash('sha512');
    hash.update(hv);
    hv = hash.digest();
  }

  // Base64 编码
  return hv.toString('base64');
}

/**
 * 新系统使用的密码加密算法（pbkdf2）
 */
export function pbkdf2HashPassword(
  password: string,
  salt?: string
): { hash: string; salt: string } {
  const realSalt = salt ?? crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, realSalt, 100_000, 32, 'sha256')
    .toString('hex');
  return { hash, salt: realSalt };
}

/**
 * 验证密码
 * 根据用户是否有 lc_object_id 来判断使用哪种加密算法
 */
export function verifyPassword(
  password: string,
  storedHash: string,
  salt: string | null,
  isLeanCloudUser: boolean
): boolean {
  if (!salt) {
    return false;
  }

  if (isLeanCloudUser) {
    // 使用 LeanCloud 算法
    const hash = leancloudHashPassword(password, salt);
    return hash === storedHash;
  } else {
    // 使用 pbkdf2 算法
    const { hash } = pbkdf2HashPassword(password, salt);
    return hash === storedHash;
  }
}
