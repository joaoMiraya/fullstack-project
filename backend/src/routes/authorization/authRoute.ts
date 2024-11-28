import { FastifyInstance } from 'fastify';
import { UserController } from '../../controllers/userController';

export async function authRoute(fastify: FastifyInstance) {
  const userController = new UserController(fastify);

  fastify.post('/register', async (request, reply) => {
    await userController.createUser(request, reply);
  });
  
  fastify.post('/login', async (request, reply) => {
    await userController.authUser(request, reply);
  });

}
