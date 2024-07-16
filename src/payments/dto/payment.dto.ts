export interface IPayment {
  customer: ICustomer;
  code: string;
  payments: IPaymentMethod[];
  items: IItem[];
}

export interface ICustomer {
  name: string;
  type: CustomerType;
  email: string;
  document: string;
  phones: ICustomerPhone;
}

export interface ICustomerPhone {
  mobile_phone: ICustomerPhoneModel;
  home_phone?: ICustomerPhoneModel;
}

export interface ICustomerPhoneModel {
  country_code: string;
  area_code: string;
  number: string;
}

export interface IPaymentMethod {
  credit_card: ICreditCard;
  payment_method: string;
  amount: number;
}

export interface ICreditCard {
  card: ICard;
  operation_type: string;
  installments: number;
  statement_descriptor: string;
}

export interface ICard {
  number: string;
  holder_name: string;
  exp_month: number;
  exp_year: number;
  cvv: string;
  brand: string;
  billing_address: ICardBillingAddress;
}

export interface ICardBillingAddress {
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

export interface IItem {
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
