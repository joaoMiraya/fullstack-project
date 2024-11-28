import { FastifyInstance } from 'fastify';
import { UserEntity } from '../entities/userEntity';

export class UserRepository {
  private db: any;

  constructor(fastify: FastifyInstance) {
    fastify.ready((err) => {
      if (err) {
        throw new Error('Error during Fastify initialization: ' + err.message);
      }
      this.db = fastify.database;
      if (!this.db) {
        throw new Error('Database connection is not available.');
      }
    });
  }

  async create(user: UserEntity): Promise<void> {
    const uid = user.getUid();
    const name = user.getName();
    const email = user.getEmail();
    const password = user.getPassword();

    try {
      await this.db.query(
        'INSERT INTO users (uid, name, email, password) VALUES (?, ?, ?, ?)',
        [uid, name, email, password]
      );
    } catch (error: any) {
      throw new Error(`Error adding user: ${error.message}`);
    }
  }
  
  async findAll(): Promise<UserEntity[]>{
    try {
      const [rows] = await this.db.query('SELECT * FROM users;');
      return rows;
    } catch (error: any) {
      throw new Error(`Error getting users: ${error.message}`);
    }
  }
  
  async findOne(email: string): Promise<UserEntity | null> {
    try {
      const query = `SELECT u.uid, u.name, u.email, u.password, u.created_at FROM users u WHERE u.email = ? LIMIT 1;`;
      const [rows]: any[] = await this.db.query(query, [email]);
      if (rows.length > 0) {
        const user = rows[0];
        return new UserEntity(user.uid, user.name, user.email, user.password, user.created_at);
      }
  
      return null;
    } catch (error: any) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }
  async getUserIdByUid(uid: string): Promise<number | null> {
    try {
      const query = `SELECT u.id FROM users u WHERE u.uid = ? LIMIT 1;`;
      const [rows]: any[] = await this.db.query(query, [uid]);
      if (rows.length > 0) {
        return rows[0].id;
      }
  
      return null;
    } catch (error: any) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }
}
