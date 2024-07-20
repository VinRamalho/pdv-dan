export enum PaymentDto {
  PAYMENT = 'payment:queue',
  CARD_PAY = 'cardPay:queue',
}

export interface IPaymentProcessReq {
  id: string;
  userId: string;
  quantity: number;
}

export interface ICardPaymentProcessReq {
  ids: string[];
  userId: string;
}
