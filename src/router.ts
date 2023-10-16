import { FastifyInstance } from "fastify";
import listPointsController from "./controllers/listPointsController";
import createOrderController from "./controllers/createOrderController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(listPointsController, { prefix: "/cart-api" }); //TODO check
  fastify.register(createOrderController, { prefix: "/process" }); //TODO check
}