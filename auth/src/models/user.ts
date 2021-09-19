import { Document, model, Schema } from 'mongoose';
import { PasswordManager } from '../utils/password-manager';

interface IUser {
  email: string;
  password: string;
}

interface IUserDoc extends Document, IUser {}

const userSchema = new Schema<IUserDoc>(
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

// before we save the user, hash the password and use that instead of the plain text password
userSchema.pre('save', async function (next) {
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

const UserModel = model<IUserDoc>('User', userSchema);

export class User extends UserModel {
  constructor(attrs: IUser) {
    super(attrs);
  }
}
