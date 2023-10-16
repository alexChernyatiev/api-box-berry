export interface RequestCreateOrderData {
    partner_token: string;
    updateByTrack: string;
    order_id: string; // Номер заказа из Tilda
    PalletNumber: string;
    barcode: string;
    price: number; // Объявленная стоимость посылки = стоимость заказа
    payment_sum: string;
    delivery_sum: string;
    vid: string;
    shop: {
        name: string;// ID выбранного пункта выдачи заказа
    };
    customer: {
        fio: string; //"Левин Лев Алексеевич",
        phone: string //"9023188464"; 10 цирф для РФ, 
        // Если Cтрана = Казахстан (CountryCode - 398) или Беларусь (112) или
        // Киргизия (417) или Армения (051), то максимальная длина номера
        // телефона - 12 символов.
        phone2: string;
        email: string; //"my-email@my.email"
    };
    items:
        [
            {
                id: string; //"MFUDadYb57stXeBDteXD" - Используем externalId товара
                name: string; //"Bonyas Box: Autumn Addition 2023",
                UnitName: string; //"шт.",
                nds: string; //
                price: string; //"7990.00",
                quantity: string; //"1",
                marking_crpt: string;
            }
        ],
    notice: string;
    weights: {
        weight: string; // всегда 500 грамм
    };
    issue: string; // всегда =0
};
