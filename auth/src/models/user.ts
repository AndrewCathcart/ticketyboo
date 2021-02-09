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

UserSchema.pre('save', async function (done) {
  const err = new Error('An error occurred whilst saving.');
  if (this.isModified('password')) {
    const hashedPw = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashedPw);
  }
  done(err);
});

const UserModel = model<IUserDoc>('User', UserSchema);

export class User extends UserModel {
  constructor(attrs: IUser) {
    super(attrs);
  }
}
