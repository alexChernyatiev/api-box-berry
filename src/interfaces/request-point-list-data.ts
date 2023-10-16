import { RequestPointListGeoData } from './request-point-list-geo-data';

export interface RequestPointListData {
  action: string; //"pickup-list",
  projectId: number; //5905464,
  postalCode: string; //"153020",
  deliveryId: string; //"2010496222",
  itemsCount: number; //1,
  cartAmount: number; //7990,
  geoData: RequestPointListGeoData;
  products: [
    {
      name: string; //'Bonya’s Box: Autumn Addition 2023';
      price: number; //7990;
      img: string; //'https://img.url';
      recid: string; //'634083300';
      lid: string; //'963070310601';
      pack_label: string; //'lwh';
      pack_m: string; //'0';
      pack_x: string; //'0';
      pack_y: string; //'0';
      pack_z: string; //'0';
      part_uids: string[]; //['579723195201'];
      uid: string; //'963070310601';
      gen_uid: string; //'963070310601';
      url: string; //'https://product.url';
      sku: string; //'pay';
      inv: 1;
      unit: string; //'PCE';
      portion: string; //'1';
      single: string; //'y';
      quantity: number; //1;
      amount: number; //7990;
      ts: number; //1696432610;
    },
  ];
  paytypes: {
    card: string; //'y';
  };
  lang: string; //'RU';
}
