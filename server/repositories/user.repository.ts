import { getDb } from '../db/client';
import { USERS_TABLE, UserRow } from '../db/schema/users.schema';

export interface CreateUserInput {
  lc_object_id?: string;
  username?: string;
  mobile_phone_number?: string;
  email?: string;
  password_hash: string;
  salt?: string;
  nick_name: string;
}

export class UserRepository {
  private db = getDb();

  findById(id: number): UserRow | undefined {
    const stmt = this.db.prepare<UserRow>(
      `SELECT * FROM ${USERS_TABLE} WHERE id = ? LIMIT 1`
    );
    return stmt.get(id) as UserRow | undefined;
  }

  findByUsernameOrMobile(usernameOrMobile: string): UserRow | undefined {
    const stmt = this.db.prepare<UserRow>(
      `SELECT * FROM ${USERS_TABLE}
       WHERE username = ? OR mobile_phone_number = ?
       LIMIT 1`
    );
    return stmt.get(usernameOrMobile, usernameOrMobile) as UserRow | undefined;
  }

  findByUsername(username: string): UserRow | undefined {
    const stmt = this.db.prepare<UserRow>(
      `SELECT * FROM ${USERS_TABLE} WHERE username = ? LIMIT 1`
    );
    return stmt.get(username) as UserRow | undefined;
  }

  findByEmail(email: string): UserRow | undefined {
    const stmt = this.db.prepare<UserRow>(
      `SELECT * FROM ${USERS_TABLE} WHERE email = ? LIMIT 1`
    );
    return stmt.get(email) as UserRow | undefined;
  }

  findByLcObjectId(lcId: string): UserRow | undefined {
    const stmt = this.db.prepare<UserRow>(
      `SELECT * FROM ${USERS_TABLE} WHERE lc_object_id = ? LIMIT 1`
    );
    return stmt.get(lcId) as UserRow | undefined;
  }

  create(input: CreateUserInput): UserRow {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      `INSERT INTO ${USERS_TABLE}
       (lc_object_id, username, mobile_phone_number, email, password_hash, salt, nick_name, status, exp, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, ?, ?)`
    );
    const info = stmt.run(
      input.lc_object_id ?? null,
      input.username ?? null,
      input.mobile_phone_number ?? null,
      input.email ?? null,
      input.password_hash,
      input.salt ?? null,
      input.nick_name,
      now,
      now
    );

    const id = Number(info.lastInsertRowid);
    const rowStmt = this.db.prepare<UserRow>(
      `SELECT * FROM ${USERS_TABLE} WHERE id = ?`
    );
    return rowStmt.get(id) as UserRow;
  }

  updatePassword(userId: number, passwordHash: string, salt?: string) {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      `UPDATE ${USERS_TABLE}
       SET password_hash = ?, salt = ?, updated_at = ?
       WHERE id = ?`
    );
    stmt.run(passwordHash, salt ?? null, now, userId);
  }

  updateExp(userId: number, delta: number) {
    const stmt = this.db.prepare(
      `UPDATE ${USERS_TABLE}
       SET exp = exp + ?
       WHERE id = ?`
    );
    stmt.run(delta, userId);
  }

  updateSessionToken(userId: number, sessionToken: string) {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      `UPDATE ${USERS_TABLE}
       SET session_token = ?, updated_at = ?
       WHERE id = ?`
    );
    stmt.run(sessionToken, now, userId);
  }

  setResetToken(userId: number, token: string, expiresAt: Date) {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      `UPDATE ${USERS_TABLE}
       SET reset_token = ?, reset_token_expires = ?, updated_at = ?
       WHERE id = ?`
    );
    stmt.run(token, expiresAt.toISOString(), now, userId);
  }

  findByResetToken(token: string): UserRow | undefined {
    const now = new Date().toISOString();
    const stmt = this.db.prepare<UserRow>(
      `SELECT * FROM ${USERS_TABLE}
       WHERE reset_token = ?
         AND reset_token_expires IS NOT NULL
         AND reset_token_expires > ?
       LIMIT 1`
    );
    return stmt.get(token, now) as UserRow | undefined;
  }

  clearResetToken(userId: number) {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      `UPDATE ${USERS_TABLE}
       SET reset_token = NULL, reset_token_expires = NULL, updated_at = ?
       WHERE id = ?`
    );
    stmt.run(now, userId);
  }

  /**
   * 更新用户会员过期时间（按天数叠加）
   */
  updateExpirationByDays(username: string, days: number): boolean {
    const user = this.findByUsername(username);
    if (!user) {
      return false;
    }

    const daysMap: Record<string, number> = {
      '1': 1,
      '3': 3,
      '7': 7,
      '30': 30,
      '31': 31,
      '91': 91,
      '183': 183,
      '365': 365,
      '666': 30 * 365
    };

    const dayNumber = daysMap[String(days)];
    if (!dayNumber) {
      return false;
    }

    const now = new Date();
    let baseTime = now.getTime();

    // 如果已有过期时间且未过期，从过期时间开始叠加
    if (user.expiration_at) {
      const prev = Date.parse(user.expiration_at);
      if (!Number.isNaN(prev) && prev > baseTime) {
        baseTime = prev;
      }
    }

    const newExpiration = new Date(baseTime + dayNumber * 24 * 60 * 60 * 1000);
    const newExpirationIso = newExpiration.toISOString();

    const updateNow = new Date().toISOString();
    const stmt = this.db.prepare(
      `UPDATE ${USERS_TABLE}
       SET expiration_at = ?, updated_at = ?
       WHERE id = ?`
    );
    stmt.run(newExpirationIso, updateNow, user.id);

    return true;
  }
}


