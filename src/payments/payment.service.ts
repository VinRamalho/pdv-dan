import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { IPayment } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  private readonly baseUrl: string = 'https://api.pagar.me/core/v5';
  private readonly key: string;
  private readonly config: AxiosRequestConfig = {
    headers: {
      'content-type': 'application/json',
    },
    maxRedirects: 5,
    timeout: 25000, // 25 seconds
  };

  constructor(private readonly httpService: HttpService) {
    const { KEY_PAGARME } = process.env;
    if (!KEY_PAGARME) {
      throw new Error('Not found env: KEY_PAGARME');
    }

    this.key = KEY_PAGARME;
    this.config.headers.Authorization = `Basic ${Buffer.from(
      `${this.key}:`,
    ).toString('base64')}`;
  }

  async createOrder(body: IPayment) {
    const { data, status } = await firstValueFrom(
      this.httpService.request({
        data: body,
        method: 'POST',
        url: `${this.baseUrl}/orders`,
        ...this.config,
      }),
    );

    if (status !== 200) {
      throw new Error('No payment completed');
    }

    return data;
  }
}
