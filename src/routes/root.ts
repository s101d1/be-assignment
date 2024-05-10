import { FastifyPluginAsync } from "fastify";
import { postLoginHandler, postSignUpHandler } from "../controllers/auth";

const postSignUpSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
    },
    confirmPassword: {
      type: "string",
    },
    name: {
      type: "string",
    },
  },
  required: ["email", "password", "confirmPassword", "name"],
};

const postLoginSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
    },
  },
  required: ["email", "password"],
};

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    "/signup",
    {
      schema: {
        body: postSignUpSchema,
        tags: ["auth"],
      },
    },
    postSignUpHandler
  );

  fastify.post(
    "/login",
    {
      schema: {
        body: postLoginSchema,
        tags: ["auth"],
      },
    },
    postLoginHandler
  );
};

export default root;
