import { Gift } from './gift.entity';

describe('Gift Entity', () => {
  it('should create a Gift', () => {
    const date = Date.now();

    const gift = new Gift({
      title: 'test',
      description: 'test',
      price: 100,
      user: {
        _id: 'test',
        name: 'test',
        email: 'test',
        createdAt: date,
        password: 'test',
        roles: [],
        status: 0,
        gifts: [],
        updatedAt: date,
      },
      createdAt: date,
      status: 0,
      _id: 'test',
    });

    expect(gift).toBeDefined();
    expect(gift.title).toBe('test');
    expect(gift.description).toBe('test');
    expect(gift.price).toBe(100);
    expect(gift.user).toBeDefined();
    expect(gift.user._id).toBe('test');
    expect(gift.user.name).toBe('test');
    expect(gift.user.email).toBe('test');
    expect(gift.user.createdAt).toBe(date);
    expect(gift.user.password).toBe('test');
    expect(gift.user.roles).toStrictEqual([]);
    expect(gift.user.status).toBe(0);
    expect(gift.user.gifts).toStrictEqual([]);
    expect(gift.user.updatedAt).toBe(date);
    expect(gift.createdAt).toBe(date);
    expect(gift.status).toBe(0);
    expect(gift._id).toBe('test');
  });
});
