export class ResponseErrorPointList {
  status: string = 'no-points';
  statusText: string = 'В городе нет пунктов выдачи.';
  countryCode: string;
  city: string;

  constructor(_countryCode: string, _city: string) {
    this.countryCode = _countryCode;
    this.city = _city;
  }
}
