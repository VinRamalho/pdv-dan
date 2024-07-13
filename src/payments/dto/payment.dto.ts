export interface Payment {
  customer: Customer;
  code: string;
  payments: PaymentMethod[];
  items: Item[];
}

export interface Customer {
  name: string;
  type: CustomerType;
  email: string;
  document: string;
  phones: CustomerPhone;
}

export interface CustomerPhone {
  mobile_phone: CustomerPhoneModel;
  home_phone?: CustomerPhoneModel;
}

export interface CustomerPhoneModel {
  country_code: string;
  area_code: string;
  number: string;
}

export interface PaymentMethod {
  credit_card: CreditCard;
  payment_method: string;
  amount: number;
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
  billing_address: CardBillingAddress;
}

export interface CardBillingAddress {
  street: string;
  number: string;
  zip_code: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  line_1: string; // order: (Número, Rua, e Bairro - Nesta ordem e separados por vírgula) Max: 256 caracteres.
  line_2?: string; // order: (Complemento - Andar, Sala, Apto). Max: 128 caracteres.
}

export interface Item {
  amount: number;
  description: string;
  quantity: number;
  code: string;
}

export enum CustomerType {
  COMPANY = 'company',
  PERSON = 'individual',
}

export enum OperationType {
  AUTH_AND_CAPTURE = 'auth_and_capture',
  AUTH_ONLY = 'auth_only',
  PRE_AUTH = 'pre_auth',
}
