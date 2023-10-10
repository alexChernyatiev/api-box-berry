import { RequestPointListGeoData } from './request-point-list-geo-data';

export class RequestPointListData {
  action: string; //"pickup-list",
  projectId: number; //5905464,
  postalCode: string; //"153020",
  deliveryId: string; //"2010496222",
  itemsCount: number; //1,
  cartAmount: number; //7990,
  geoData: RequestPointListGeoData;
  products: [
    {
      name: 'Bonya’s Box: Autumn Addition 2023';
      price: 7990;
      img: 'https://img.url';
      recid: '634083300';
      lid: '963070310601';
      pack_label: 'lwh';
      pack_m: '0';
      pack_x: '0';
      pack_y: '0';
      pack_z: '0';
      part_uids: ['579723195201'];
      uid: '963070310601';
      gen_uid: '963070310601';
      url: 'https://product.url';
      sku: 'pay';
      inv: 1;
      unit: 'PCE';
      portion: '1';
      single: 'y';
      quantity: 1;
      amount: 7990;
      ts: 1696432610;
    },
  ];
  paytypes: {
    card: 'y';
  };
  lang: 'RU';
}
