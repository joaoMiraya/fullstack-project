import { FastifyPluginAsync } from 'fastify'
import { userRoutes } from './users/userRoutes';
import { authRoute } from './authorization/authRoute';
import { privateRoutes } from './authorization/privateRoutes';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  //routes
  fastify.register(userRoutes);
  fastify.register(authRoute);
  fastify.register(privateRoutes);
}

export default root;
