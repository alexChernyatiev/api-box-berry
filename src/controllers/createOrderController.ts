import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { BoxBerryService } from "../services/box-berry-service";
import { AirTableRepository } from "../airTable/airTableRepository";
import { RequestCreateOrderData } from "../classes/request-create-order-data";
import { CONTENT_TYPE, CONTENT_TYPE_VALUE_RESPONSE } from "../constants";

export default async function createOrderController(fastify: FastifyInstance) {
    fastify.post("/", async function (
        _request: FastifyRequest,
        reply: FastifyReply
    ): Promise<void> {
        const orderData: RequestCreateOrderData = _request.body as RequestCreateOrderData;

        const newOrderTrack = await BoxBerryService.createOrderAtBoxBerry(orderData);

        const airTable = new AirTableRepository();
        await airTable.saveTrackToAirTable(orderData.order_id, newOrderTrack);

        reply
          .header(CONTENT_TYPE, CONTENT_TYPE_VALUE_RESPONSE)
          .send(newOrderTrack);
    });
}
