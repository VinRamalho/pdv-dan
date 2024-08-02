import mongoose, { Model } from 'mongoose';
import { User } from './user.entity';
import { UserDocument, UserSchemaFactory } from '../schemas/user.schema';
import { DataStatus } from 'src/data/dto/data.dto';
import { Role } from 'src/permission/dto/permission.dto';

describe('User Entity', () => {
  const userDefault: Partial<User> = {
    name: 'test',
    email: 'test@test.com',
    status: DataStatus.ENABLED,
    password: 'test',
    roles: [Role.ADMIN],
    gifts: [],
  };

  describe('User Class', () => {
    it('should create a User', () => {
      const user = new User(userDefault);

      expect(user).toBeDefined();
      expect(user.name).toBe('test');
      expect(user.email).toBe('test@test.com');
      expect(user.status).toBe(DataStatus.ENABLED);
      expect(user.password).toBe('test');
      expect(user.roles).toBeDefined();
      expect(user.gifts).toBeDefined();
    });
  });

  describe('User Schema Mongo', () => {
    let conn: mongoose.Mongoose;
    let userModel: Model<UserDocument>;
    let userId: mongoose.Types.ObjectId;

    beforeAll(async () => {
      conn = await mongoose.connect(process.env.MONGO_URL);
      userModel = conn.model<UserDocument>('User', UserSchemaFactory);
    });

    afterAll(async () => {
      await conn.disconnect();
    });

    it('should create a User document', async () => {
      const user = new userModel(userDefault);
      userId = user._id;
      await user.save();
    });

    it('should read a User document', async () => {
      const userCreated = await userModel.findById(userId);
      expect(userCreated).toBeDefined();
      expect(userCreated.name).toBe('test');
      expect(userCreated.email).toBe('test@test.com');
      expect(userCreated.status).toBe(DataStatus.ENABLED);
      expect(userCreated.password).toBe('test');
      expect(userCreated.roles).toBeDefined();
      expect(userCreated.gifts).toBeDefined();
    });

    it('should update a User document', async () => {
      await userModel.findByIdAndUpdate(userId, { name: 'test2' });

      const userUpdated = await userModel.findById(userId, 'name');
      expect(userUpdated).toBeDefined();
      expect(userUpdated.name).toBe('test2');
    });

    it('should delete a User document', async () => {
      await userModel.findByIdAndDelete(userId);

      const userDeleted = await userModel.findById(userId);
      expect(userDeleted).toBeNull();
    });
  });
});
