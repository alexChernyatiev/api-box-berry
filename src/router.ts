import { FastifyInstance } from "fastify";
import listPointsController from "./controllers/listPointsController";
import createOrderController from "./controllers/createOrderController";

export default async function router(fastify: FastifyInstance) {
  fastify.register(listPointsController, { prefix: "/cart-api" });
  fastify.register(createOrderController, { prefix: "/create_order" }); //TODO change
}