import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import mysql from 'mysql2/promise'; 

async function dbPlugin(fastify: FastifyInstance) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    fastify.decorate('database', connection);

    fastify.addHook('onClose', (instance, done) => {
      connection.end().then(() => done()).catch(done);
    });

    fastify.log.info('Database connected successfully!');
  } catch (error) {
    fastify.log.error('Failed to connect to database:', error);
    throw error;
  }
}

export default fp(dbPlugin, {
  name: 'mysql-connection',
});
