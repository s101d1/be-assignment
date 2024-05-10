import { FastifyPluginAsync } from "fastify";
import {
  postSendTransactionHandler,
  postWithdrawTransactionHandler,
} from "../../controllers/transaction";

const postTransactionSchema = {
  type: "object",
  properties: {
    currency: {
      type: "string",
    },
    amount: {
      type: "number",
    },
    toAddress: {
      type: "string",
    },
    accountId: {
      type: "string",
    },
  },
  required: ["currency", "amount", "toAddress", "accountId"],
};

const transactionsRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.post(
    "/send",
    {
      schema: {
        body: postTransactionSchema,
        tags: ["transaction"],
      },
      onRequest: (req, reply) => fastify.authenticate(req, reply),
    },
    postSendTransactionHandler
  );

  fastify.post(
    "/withdraw",
    {
      schema: {
        body: postTransactionSchema,
        tags: ["transaction"],
      },
      onRequest: (req, reply) => fastify.authenticate(req, reply),
    },
    postWithdrawTransactionHandler
  );
};

export default transactionsRoute;
