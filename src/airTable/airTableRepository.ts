import Airtable, { FieldSet, Table } from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";

export class AirTableRepository {
    private base: AirtableBase;
    private readonly DELIVERY_METHOD = 'BoxBerry';

    constructor() {
        const baseId = process.env.AIR_TABLE_BASE || '';
        this.base = new Airtable({ apiKey: process.env.AIR_TABLE_API_KEY }).base(baseId);
    }

    // public async getRecords(table: Table<FieldSet>) {
    //     let records;
    //     try {
    //         records = await table.select().firstPage();
    //         console.log(records);
    //     } catch (err) {
    //         console.log(err);
    //     }

    //     return records;
    // }

    public async saveTrackToAirTable(order_id: string, track: string): Promise<string> {
        const table = this.base(process.env.AIR_TABLE_ORDER_TABLE || '');

        let res;
        try {
            res = await table.create({
                'Номер заказа': order_id,
                'Способ доставки': this.DELIVERY_METHOD,
                'Трек-код': track,
            });
        } catch (err) {
            console.log(err);
            throw err;
        }

        return res?.id;
    }
}
