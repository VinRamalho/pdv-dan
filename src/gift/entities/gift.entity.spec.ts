import mongoose, { Model } from 'mongoose';
import { Gift } from './gift.entity';
import { GiftchemaFactory, GiftDocument } from '../schemas/gift.schema';
import { DataStatus } from 'src/data/dto/data.dto';

describe('Gift Entity', () => {
  const giftDefault: Partial<GiftDocument> = {
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
    let giftModel: Model<GiftDocument>;
    let giftId: mongoose.Types.ObjectId;

    beforeAll(async () => {
      conn = await mongoose.connect(process.env.MONGO_URL);
      giftModel = conn.model<GiftDocument>('Gift', GiftchemaFactory);
    });

    afterAll(async () => {
      await conn.disconnect();
    });

    it('should create a Gift document', async () => {
      const gift = new giftModel(giftDefault);
      giftId = gift._id;
      await gift.save();
    });

    it('should read a Gift document', async () => {
      const giftCreated = await giftModel.findById(giftId);
      expect(giftCreated).toBeDefined();
      expect(giftCreated.title).toBe('test');
      expect(giftCreated.description).toBe('test');
      expect(giftCreated.price).toBe(100);
      expect(giftCreated.status).toBe(DataStatus.ENABLED);
    });

    it('should update a Gift document', async () => {
      await giftModel.findByIdAndUpdate(giftId, { title: 'test2' });

      const giftUpdated = await giftModel.findById(giftId, 'title');
      expect(giftUpdated).toBeDefined();
      expect(giftUpdated.title).toBe('test2');
    });

    it('should delete a Gift document', async () => {
      await giftModel.findByIdAndDelete(giftId);

      const giftDeleted = await giftModel.findById(giftId);
      expect(giftDeleted).toBeNull();
    });
  });
});
