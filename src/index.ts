import axios, { AxiosRequestConfig } from "axios";
import fastify from "fastify";
import * as test_request_get_points from './test_request_get_points.json';
import * as test_request_create_order from './test_request_create_order.json';
import { ResponsePointListInfo } from './classes/response-point-list-info';
import { BoxBerryApiMethods } from './classes/enums/box-berry-api-methods';
import { PointBoxBerryResponse } from './classes/box-berry-classes/point-box-berry-response';
import { CountryISO } from './classes/enums/country-iso';
import { BOX_BERRY_URL, CREATE_ORDER_CONTENT_TYPE, TOKEN } from './constants';
import { RequestPointListGeoData } from './classes/request-point-list-geo-data';
import { ResponseErrorPointList } from './classes/response-error-point-list';

const server = fastify();

server.get("/pickup-list", async (): Promise<ResponseErrorPointList | ResponsePointListInfo[]> => {
  const requestData = test_request_get_points;

  if (!requestData || !requestData?.geoData) {
    throw new Error('Нет информации о местоположении!');
  }

  return getPickupList(requestData.geoData);
});

server.get("/create-order", async (): Promise<string> => {
  const orderData = test_request_create_order;

  const newOrderTrack = await createOrderAtBoxBerry(orderData);
  await addTrackToAirTable(newOrderTrack);
  return newOrderTrack;
});

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

const getPickupList = async (
  geoData: RequestPointListGeoData
): Promise<ResponseErrorPointList | ResponsePointListInfo[]> => {
  if (!geoData?.countryIso || !geoData?.externalIds?.boxberry) {
    throw new Error('Нет информации о стране или городе.');
  }

  const countryCode = CountryISO[geoData.countryIso];
  const cityCode = Number(geoData?.externalIds?.boxberry);
  const points = await getPickupListFromBoxBerryByCityAndCountry(
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

const getPickupListFromBoxBerryByCityAndCountry = async (
  countryCode: number,
  cityCode: number,
): Promise<PointBoxBerryResponse[]> => {
  const requestConfig = {
    params: {
      token: TOKEN,
      method: BoxBerryApiMethods.ListPoints,
      CityCode: cityCode,
      CountryCode: countryCode,
      prepaid: 1,
    },
  };

  const { data } = await axios.get<PointBoxBerryResponse[]>(BOX_BERRY_URL, requestConfig);
  return data;
}

const createOrderAtBoxBerry = async (order: any): Promise<string> => {
  const requestConfig: AxiosRequestConfig = {
    headers: {
      'Content-Type': CREATE_ORDER_CONTENT_TYPE,
    },
  };

  const body = {
    token: 'd6f33e419c16131e5325cbd84d5d6000', //TODO fix
    method: BoxBerryApiMethods.ParselCreate,
    sdata: JSON.stringify(order),
  };

  const { data } = await axios.post<{ track: string, notification: string, label: string }>(BOX_BERRY_URL, body, requestConfig);
  // return data?.track; //TODO uncomment
  return 'AAP127020243';
}

const addTrackToAirTable = async (track: string): Promise<void> => {
  console.log(track);
  // const base = new Airtable({
  //   apiKey: 'https://api-airtable-com-8hw7i1oz63iz.runscope.net/',
  // }).base('asdfghjk');

  // const table = base('proj');
  // await table.create({ track });
}