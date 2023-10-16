import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import NodeCache from "node-cache";
import { ResponsePointListInfo } from "../interfaces/response-point-list-info";
import { RequestPointListData } from "../interfaces/request-point-list-data";
import { CONTENT_TYPE, CONTENT_TYPE_VALUE_RESPONSE } from "../constants";
import { ListPointsService } from "../services/listPointsService";

const cache = new NodeCache({
  stdTTL: 60 * 60 * 6, // cache data for 6 hours
  checkperiod: 0,
});

export default async function listPointsController(fastify: FastifyInstance) {
  //TODO remove
  fastify.get("/", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    return reply.send('Hello world!'); 
  });

  fastify.post("/", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const requestData: RequestPointListData = _request.body as RequestPointListData;

    if (!requestData?.geoData?.externalIds?.boxberry || !requestData?.geoData?.countryIso) {
      throw new Error('Нет информации о местоположении!');
    }

    const geoData = requestData.geoData;

    const cacheName = geoData.countryIso + '-' + geoData.externalIds.boxberry;
    const value: ResponsePointListInfo[] | undefined = cache.get(cacheName);
    if (value) {
      return reply
      .header(CONTENT_TYPE, CONTENT_TYPE_VALUE_RESPONSE)
      .send(value);
    }

    const pickupList = await ListPointsService.getPickupList(geoData);
    cache.set(cacheName, pickupList);

    return reply
      .header(CONTENT_TYPE, CONTENT_TYPE_VALUE_RESPONSE)
      .send(pickupList);
  });
}
