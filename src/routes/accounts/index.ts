import { FastifyPluginAsync } from "fastify";
import {
  getUserAccountsHandler,
  postUserAccountsHandler,
} from "../../controllers/account";
import { CREDIT, DEBIT, LOAN } from "../../models/dto/account";

const postUserAccountsSchema = {
  type: "object",
  properties: {
    type: {
      enum: [CREDIT, DEBIT, LOAN],
    },
    currency: {
      type: "string",
    },
    initialBalance: {
      type: "number",
    },
  },
  required: ["type", "currency", "initialBalance"],
};

const accountsRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: postUserAccountsSchema,
        tags: ["account"],
      },
      onRequest: (req, reply) => fastify.authenticate(req, reply),
    },
    postUserAccountsHandler
  );

  fastify.get(
    "/",
    {
      schema: {
        tags: ["account"],
      },
      onRequest: (req, reply) => fastify.authenticate(req, reply),
    },
    getUserAccountsHandler
  );
};

export default accountsRoute;
