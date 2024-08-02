import { Test, TestingModule } from '@nestjs/testing';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { UserService } from 'src/users/user.service';
import { getModelToken } from '@nestjs/mongoose';
import { GiftSchema } from './schemas/gift.schema';
import { QueueProcessPaymentService } from 'src/queue/payment/payment.producer.service';
import { GiftDto } from './dto/gift.dto';
import { DataStatus } from 'src/data/dto/data.dto';

describe('GiftController', () => {
  let controller: GiftController;
  let giftService: GiftService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftController],
      providers: [
        {
          provide: GiftService,
          useValue: {
            create: jest.fn(),
            findByUserId: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            processCartPayment: jest.fn(),
            processPayment: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            addItemById: jest.fn(),
            removeItemById: jest.fn(),
          },
        },
        {
          provide: getModelToken(GiftSchema.name),
          useValue: {}, // mock do modelo Mongoose
        },
        {
          provide: QueueProcessPaymentService,
          useValue: {
            pay: jest.fn(),
            cartPay: jest.fn(),
          }, // mock do serviço QueueProcessPaymentService
        },
      ],
    }).compile();

    controller = module.get<GiftController>(GiftController);
    giftService = module.get<GiftService>(GiftService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Aqui você pode adicionar mais testes para os métodos do GiftController

  // Exemplo de um teste para o método create
  it('should call giftService.create and userService.addItemById', async () => {
    const req = { user: { _id: 'someUserId' } };
    const createGiftDto = {
      title: 'Gift',
      description: 'A wonderful gift',
      price: 100,
      status: DataStatus.ENABLED,
    } as GiftDto;

    const createdGift = { ...createGiftDto, _id: 'someGiftId' };
    jest.spyOn(giftService, 'create').mockResolvedValue(createdGift as any);
    jest.spyOn(userService, 'addItemById').mockResolvedValue(undefined);

    const result = await controller.create(createGiftDto, req);

    expect(giftService.create).toHaveBeenCalledWith({
      ...createGiftDto,
      user: req.user._id,
    });
    expect(userService.addItemById).toHaveBeenCalledWith(
      req.user._id,
      'gifts',
      createdGift._id,
    );
    expect(result).toEqual(createdGift);
  });
});
