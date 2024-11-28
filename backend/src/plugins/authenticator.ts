import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { JWT } from '@fastify/jwt'

const fp = require("fastify-plugin")

declare module 'fastify' {
    interface FastifyRequest {
      jwt: JWT
    }
  }

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

module.exports = fp(async function(fastify: FastifyInstance, opts: any) {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET
  })
  
  fastify.decorate("authenticate", async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
})