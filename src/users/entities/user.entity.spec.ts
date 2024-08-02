import mongoose from 'mongoose';
import { User } from './user.entity';
import { UserSchemaFactory } from '../schemas/user.schema';
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
    let userId;

    beforeEach(async () => {
      conn = await mongoose.connect(process.env.MONGO_URL);
    });

    afterEach(async () => {
      await conn.disconnect();
    });

    it('Create a User document', async () => {
      const userModel = conn.model('User', UserSchemaFactory);

      const user = new userModel(userDefault);
      userId = user._id;

      await user.save();
    });

    it('Read a User document', async () => {
      const userModel = conn.model('User', UserSchemaFactory);

      const userCreated = await userModel.findById(userId);

      expect(userCreated).toBeDefined();
      expect(userCreated.name).toBe('test');
      expect(userCreated.email).toBe('test@test.com');
      expect(userCreated.status).toBe(DataStatus.ENABLED);
      expect(userCreated.password).toBe('test');
      expect(userCreated.roles).toBeDefined();
      expect(userCreated.gifts).toBeDefined();
    });

    it('Update a User document', async () => {
      const userModel = conn.model('User', UserSchemaFactory);

      await userModel.findByIdAndUpdate(userId, {
        $set: { name: 'test2' },
      });

      const userCreated = await userModel.findById(userId, 'name');

      expect(userCreated).toBeDefined();
      expect(userCreated.name).toBe('test2');
    });

    it('Delete a User document', async () => {
      const userModel = conn.model('User', UserSchemaFactory);

      await userModel.findByIdAndDelete(userId);

      const userCreated = await userModel.findById(userId);

      expect(userCreated).toBeNull();
    });
  });
});
