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
}


