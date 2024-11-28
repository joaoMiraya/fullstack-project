import { FastifyInstance } from 'fastify';
import { RoutesController } from '../../controllers/routeController';
import { RaceController } from '../../controllers/raceController';

export async function privateRoutes(fastify: FastifyInstance) {
  
  const rideConfirmSchema = {
    type: 'object',
    properties: {
      customer_id: { type: 'string' },
      origin: { type: 'string' },
      destination: { type: 'string' },
      distance: { type: 'number' },
      duration: { type: 'string' },
      driver: { type: 'string' },
      value: { type: 'number' },
    },
    required: [
      'customer_id',
      'origin',
      'destination',
      'distance',
      'duration',
      'driver',
      'value',
    ],
  };

  const schema = {
    body: rideConfirmSchema,
  };
 
  const routeController = new RoutesController(fastify);
  const raceController = new RaceController(fastify);
  fastify.post('/ride/estimate',  {onRequest: [fastify.authenticate]}, async (request, reply) => {
    await routeController.calculateRoute(request, reply);
  });

  fastify.post(
    '/ride/confirm',
    {
      schema,
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      await raceController.confirmRace(request, reply);
    }
  );

  fastify.post('/ride/cancel',  {onRequest: [fastify.authenticate]}, async (request, reply) => {
    await raceController.cancelRace(request, reply);
  });

  fastify.post('/ride/done',  {onRequest: [fastify.authenticate]}, async (request, reply) => {
    await raceController.doneRace(request, reply);
  });

  fastify.post('/ride/rating',  {onRequest: [fastify.authenticate]}, async (request, reply) => {
    await raceController.setRating(request, reply);
  });

  fastify.get('/ride/:customer_id',  {onRequest: [fastify.authenticate]}, async (request, reply) => {
    await raceController.getHistoryRace(request, reply);
  });

  fastify.get('/ride/:customer_id/:driver_id',  {onRequest: [fastify.authenticate]}, async (request, reply) => {
    await raceController.getHistoryRace(request, reply);
  });

  fastify.get('/ride/get/address/:lat/:lng',  {onRequest: [fastify.authenticate]}, async (request, reply) => {
    await raceController.getAddressFromCordinates(request, reply);
  });
}
