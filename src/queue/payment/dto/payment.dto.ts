export enum PaymentDto {
  PAYMENT = 'payment:queue',
}

export interface IPaymentProcessReq {
  id: string;
  userId: string;
  quantity: number;
}
