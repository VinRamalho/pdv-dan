import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GiftService } from './gift.service';
import { GiftSchema } from './schemas/gift.schema';
import { QueueProcessPaymentService } from 'src/queue/payment/payment.producer.service';

describe('GiftService', () => {
  let service: GiftService;
  let model: Model<GiftSchema>;
  let queueService: QueueProcessPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GiftService,
        {
          provide: getModelToken(GiftSchema.name),
          useValue: Model, // Mock the Mongoose model
        },
        {
          provide: QueueProcessPaymentService,
          useValue: {
            pay: jest.fn(),
            cartPay: jest.fn(),
          }, // Mock the QueueProcessPaymentService
        },
      ],
    }).compile();

    service = module.get<GiftService>(GiftService);
    model = module.get<Model<GiftSchema>>(getModelToken(GiftSchema.name));
    queueService = module.get<QueueProcessPaymentService>(
      QueueProcessPaymentService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
