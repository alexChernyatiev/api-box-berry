import { CountryISO } from "../interfaces/enums/country-iso";
import { RequestPointListGeoData } from "../interfaces/request-point-list-geo-data";
import { ResponseErrorPointList } from "../interfaces/classes/response-error-point-list";
import { ResponsePointListInfo } from "../interfaces/response-point-list-info";
import { BoxBerryService } from "./box-berry-service";

export class ListPointsService {
    public static async getPickupList(
        geoData: RequestPointListGeoData
    ): Promise<ResponseErrorPointList | ResponsePointListInfo[]> {
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