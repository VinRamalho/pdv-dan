import mongoose from 'mongoose';
import { Gift } from './gift.entity';
import { GiftchemaFactory } from '../schemas/gift.schema';
import { DataStatus } from 'src/data/dto/data.sto';

describe('Gift Entity', () => {
  const giftDefault: Partial<Gift> = {
    title: 'test',
    description: 'test',
    price: 100,
    status: DataStatus.ENABLED,
  };

  describe('Gift Class', () => {
    it('should create a Gift', () => {
      const gift = new Gift(giftDefault);

      expect(gift).toBeDefined();
      expect(gift.title).toBe('test');
      expect(gift.description).toBe('test');
      expect(gift.price).toBe(100);
      expect(gift.status).toBe(DataStatus.ENABLED);
    });
  });

  describe('Gift Schema Mongo', () => {
    let conn: mongoose.Mongoose;
    let giftId;

    beforeEach(async () => {
      conn = await mongoose.connect(process.env.MONGO_URL);
    });

    afterEach(async () => {
      await conn.disconnect();
    });

    it('Create a Gift document', async () => {
      const giftModel = conn.model('Gift', GiftchemaFactory);

      const gift = new giftModel(giftDefault);
      giftId = gift._id;

      await gift.save();
      const giftCreated = await giftModel.findById(gift._id);

      expect(giftCreated).toBeDefined();
      expect(giftCreated.title).toBe('test');
      expect(giftCreated.description).toBe('test');
      expect(giftCreated.price).toBe(100);
      expect(giftCreated.status).toBe(DataStatus.ENABLED);
    });

    it('Update a Gift document', async () => {
      const giftModel = conn.model('Gift', GiftchemaFactory);

      await giftModel.findByIdAndUpdate(giftId, {
        $set: { title: 'test2' },
      });

      const giftCreated = await giftModel.findById(giftId);

      expect(giftCreated).toBeDefined();
      expect(giftCreated.title).toBe('test2');
      expect(giftCreated.description).toBe('test');
      expect(giftCreated.price).toBe(100);
      expect(giftCreated.status).toBe(DataStatus.ENABLED);
    });

    it('Delete a Gift document', async () => {
      const giftModel = conn.model('Gift', GiftchemaFactory);

      await giftModel.findByIdAndDelete(giftId);

      const giftCreated = await giftModel.findById(giftId);

      expect(giftCreated).toBeNull();
    });
  });
});
