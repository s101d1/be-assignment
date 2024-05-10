import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
  fastify.register(import("@fastify/jwt"), {
    secret: process.env.JWT_SECRET_KEY as string,
  });

  fastify.decorate(
    "authenticate",
    async function (req: FastifyRequest, reply: FastifyReply) {
      try {
        await req.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
});

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => unknown
  }
}
