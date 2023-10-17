import axios, { AxiosRequestConfig } from "axios";
import { BoxBerryApiMethods } from '../interfaces/enums/box-berry-api-methods';
import { PointBoxBerryResponse } from '../interfaces/box-berry-interfaces/point-box-berry-response';
import { BOX_BERRY_URL, CREATE_ORDER_CONTENT_TYPE } from '../constants';
import { CreateErrBoxBerryResponse } from "../interfaces/box-berry-interfaces/create-err-box-berry-response";

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

        try {
            const { data } = await axios.get<PointBoxBerryResponse[]>(BOX_BERRY_URL, requestConfig);
            return data;
        } catch (err: any) {
            console.log('Problem with getting list of points in BoxBerry.', err?.message);
            throw err;
        }
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

        let track;
        try {
            const { data } = await axios.post<CreateErrBoxBerryResponse>(BOX_BERRY_URL, body, requestConfig);
            track = data?.track;

            if(!track) {
                throw new Error(`Problem with creating order in BoxBerry: ${data.err}.`);
            }

            return track;
        } catch (err: any) {
            console.log('Problem with creating order in .', err.message);
            throw err;
        }
    }
}
