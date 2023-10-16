import axios, { AxiosRequestConfig } from "axios";
import { BoxBerryApiMethods } from '../interfaces/enums/box-berry-api-methods';
import { PointBoxBerryResponse } from '../interfaces/box-berry-interfaces/point-box-berry-response';
import { BOX_BERRY_URL, CREATE_ORDER_CONTENT_TYPE } from '../constants';

export class BoxBerryService {
    private static readonly prepaidForBoxBerry = 1;

    public static async getPickupListFromBoxBerryByCityAndCountry(
        countryCode: number,
        cityCode: number,
    ): Promise<PointBoxBerryResponse[]> {
        const requestConfig = {
            params: {
                token: process.env.BOX_BERRY_TOKEN,
                method: BoxBerryApiMethods.ListPoints,
                CityCode: cityCode,
                CountryCode: countryCode,
                prepaid: BoxBerryService.prepaidForBoxBerry,
            },
        };

        const { data } = await axios.get<PointBoxBerryResponse[]>(BOX_BERRY_URL, requestConfig);
        return data;
    }

    public static async createOrderAtBoxBerry(order: any): Promise<string> {
        const requestConfig: AxiosRequestConfig = {
            headers: {
                CONTENT_TYPE: CREATE_ORDER_CONTENT_TYPE,
            },
        };

        const body = {
            token: process.env.BOX_BERRY_TOKEN,
            method: BoxBerryApiMethods.ParselCreate,
            sdata: JSON.stringify(order),
        };

        const { data } = await axios.post<{ track: string, notification: string, label: string }>(BOX_BERRY_URL, body, requestConfig);

        if(!data?.track) {
            throw new Error('Проблема при создании заказа в BoxBerry.');
        }

        return data?.track;
    }
}
