import { Document, model, Schema } from 'mongoose';
import { PasswordManager } from '../utils/password-manager';

interface IUser {
  email: string;
  password: string;
}

interface IUserDoc extends Document, IUser {}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const hashedPw = await PasswordManager.toHash(this.get('password'));
      this.set('password', hashedPw);
    } catch (error) {
      console.log(error);
      next(new Error('An error occurred whilst saving.'));
    }
  }
  next();
});

const UserModel = model<IUserDoc>('User', UserSchema);

export class User extends UserModel {
  constructor(attrs: IUser) {
    super(attrs);
  }
}
