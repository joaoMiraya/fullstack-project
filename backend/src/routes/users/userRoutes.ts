import { FastifyInstance } from 'fastify';
import { UserController } from '../../controllers/userController';
import { RaceController } from '../../controllers/raceController';

export async function userRoutes(fastify: FastifyInstance) {
  const userController = new UserController(fastify);
  const raceController = new RaceController(fastify);

  fastify.get('/users', async (request, reply) => {    
    await userController.getUsers(request, reply);
  });

  fastify.get('/users/:id', async (request, reply) => {    
    await userController.getUsers(request, reply);
  });

  fastify.get('/driver/rating/:uid',  {onRequest: [fastify.authenticate]}, async (request, reply) => {
    await raceController.getDriverRatingAverage(request, reply);
  });

  fastify.get('/driver/:uid',  {onRequest: [fastify.authenticate]}, async (request, reply) => {
    await raceController.getDriver(request, reply);
  });
}
