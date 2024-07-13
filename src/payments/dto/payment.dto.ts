export interface Payment {
  customer: Customer;
  code: string;
  payments: PaymentMethod[];
  items: Item[];
}

export interface Customer {
  name: string;
  type: string;
  email: string;
}

export interface PaymentMethod {
  credit_card: CreditCard;
  payment_method: string;
}

export interface CreditCard {
  card: Card;
  operation_type: string;
  installments: number;
  statement_descriptor: string;
}

export interface Card {
  number: string;
  holder_name: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  brand: string;
}

export interface Item {
  amount: number;
  description: string;
  quantity: number;
  code: string;
}
