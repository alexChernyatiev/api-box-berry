import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ResponseErrorPointList } from "../classes/response-error-point-list";
import { ResponsePointListInfo } from "../classes/response-point-list-info";
import { RequestPointListData } from "../classes/request-point-list-data";
import { RequestPointListGeoData } from '../classes/request-point-list-geo-data';
import { BoxBerryService } from "../services/box-berry-service";
import { CountryISO } from "../classes/enums/country-iso";
import NodeCache from "node-cache";
import { CONTENT_TYPE, CONTENT_TYPE_VALUE_RESPONSE } from "../constants";

const cache = new NodeCache({
  stdTTL: 60 * 60 * 6, // cache data for 6 hours
  checkperiod: 0,
});

export default async function listPointsController(fastify: FastifyInstance) {
  fastify.post("/", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const requestData: RequestPointListData = _request.body as RequestPointListData;

    if (!requestData?.geoData?.externalIds?.boxberry || !requestData?.geoData?.countryIso) {
      throw new Error('Нет информации о местоположении!');
    }

    const geoData = requestData.geoData;

    const cacheName = _request.url + geoData.countryIso + geoData.externalIds.boxberry;
    const value: ResponsePointListInfo[] | undefined = cache.get(cacheName);
    if (value) {
      reply
      .header(CONTENT_TYPE, CONTENT_TYPE_VALUE_RESPONSE)
      .send(value);
    }

    const pickupList = await getPickupList(geoData);
    cache.set(cacheName, pickupList);

    // return pickupList;
    reply
      .header(CONTENT_TYPE, CONTENT_TYPE_VALUE_RESPONSE)
      .send(pickupList);
  });

  const getPickupList = async (
    geoData: RequestPointListGeoData
  ): Promise<ResponseErrorPointList | ResponsePointListInfo[]> => {
    if (!geoData?.countryIso || !geoData?.externalIds?.boxberry) {
      throw new Error('Нет информации о стране или городе.');
    }
  
    const countryCode = CountryISO[geoData.countryIso as keyof typeof CountryISO];
    const cityCode = Number(geoData?.externalIds?.boxberry);
    const points = await BoxBerryService.getPickupListFromBoxBerryByCityAndCountry(
      countryCode,
      cityCode,
    );
  
    if (!points?.length) {
      return new ResponseErrorPointList(geoData?.countryIso, geoData.name);
    }
  
    const result: ResponsePointListInfo[] = points.map(
      (point): ResponsePointListInfo => {
        return {
          id: point.Code,
          postalCode: geoData?.postalCode,
          name: point.Name,
          workTime: point.WorkShedule,
          city: point.CityName,
          address: point.Address,
          addressComment: point.TripDescription,
          phones: [point.Phone],
          coordinates: point.GPS.split(',').map((gps) => Number(gps)),
        };
      },
    );
  
    return result;
  }
}
