import db from "./../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
};

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export class Users {
  //   get all users
  async index(): Promise<User[] | undefined> {
    try {
      // should have a token
      const conn = await db.connect();
      const sql = "SELECT * FROM  users";

      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error("error getting users from users table error: " + error);
    }
  }

  // get user by id

  async show(id: number): Promise<User | undefined> {
    try {
      // should have a token
      const conn = await db.connect();
      const sql = "SELECT * FROM  users WHERE id=$1";

      const { rows } = await conn.query(sql, [id]);
      conn.release();
      if (rows.length < 1)
        throw new Error(`no associated user with this id: ${id}`);
      return rows[0];
    } catch (error) {
      throw new Error("error getting user from users table, error: " + error);
    }
  }
  // craete new user
  async create(u: User): Promise<User | undefined> {
    try {
      const conn = await db.connect();
      const sql =
        "INSERT INTO users (first_name, last_name, username, password_digest) VALUES ($1,$2,$3,$4) RETURNING *";

      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      );

      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.username,
        hash,
      ]);

      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error("error creating new user, error: " + error);
    }
  }

  // update user info:
  async update(u: User): Promise<User | undefined> {
    try {
      const conn = await db.connect();
      const sql =
        "UPDATE users SET first_name=$1, last_name=$2, username=$3, password_digest=$4 WHERE id=$5 RETURNING *";

      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      );

      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.username,
        hash,
        u.id,
      ]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error("error updating  user" + u.username + " error: " + error);
    }
  }
  async destroy(id: number): Promise<User | undefined> {
    try {
      const conn = await db.connect();
      const sql = "DELETE FROM users WHERE id=$1 RETURNING *";

      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error("error removing user, error: " + error);
    }
  }

  // user access db auth
  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const conn = await db.connect();
      const sql = "SELECT * FROM users WHERE username=$1";

      const result = await conn.query(sql, [username]);

      if (result.rows.length) {
        const user = result.rows[0];
        if (
          bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password_digest)
        ) {
          return user;
        }
      }
      return null;
    } catch (error) {
      throw new Error("error authenticating user, error: " + error);
    }
  }
}
