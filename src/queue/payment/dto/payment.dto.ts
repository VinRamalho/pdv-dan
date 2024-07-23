export enum PaymentDto {
  PAYMENT = 'payment:queue',
  CART_PAY = 'cartPay:queue',
}

export interface IPaymentProcessReq {
  id: string;
  userId: string;
  quantity: number;
}

export interface ICartPaymentProcessReq {
  ids: string[];
  userId: string;
}
