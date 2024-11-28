/* import { FastifyInstance } from "fastify";

export class Authorization {

    private fastify;

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
    }
    
    this.fastify
    .decorate('verifyJWTandLevel', function (request, reply, done) {
      // your validation logic
      done() // pass an error if the authentication fails
    })
    .decorate('verifyUserAndPassword', function (request, reply, done) {
      // your validation logic
      done() // pass an error if the authentication fails
    })
    .register(require('@fastify/auth'))
    .after(() => {
      fastify.route({
        method: 'POST',
        url: '/auth-multiple',
        preHandler: fastify.auth([
          fastify.verifyJWTandLevel,
          fastify.verifyUserAndPassword
        ]),
        handler: (req, reply) => {
          req.log.info('Auth route')
          reply.send({ hello: 'world' })
        }
      })
    })
} */