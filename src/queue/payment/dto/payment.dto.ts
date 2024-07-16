export enum PaymentDto {
  PAYMENT = 'payment:queue',
}

export interface PaymentProcessReq {
  id: string;
  userId: string;
  quantity: number;
}
