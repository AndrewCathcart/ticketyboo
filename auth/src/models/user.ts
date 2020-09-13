import { Schema, Document, model } from 'mongoose';
import { Password } from '../utils/password';

interface IUser {
  email: string;
  password: string;
}

type UserDoc = Document & IUser;

const UserSchema: Schema = new Schema<UserDoc>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPw = await Password.toHash(this.get('password'));
    this.set('password', hashedPw);
  }
  done();
});

const UserModel = model<UserDoc>('User', UserSchema);

export class User extends UserModel {
  constructor(attrs: IUser) {
    super(attrs);
  }
}
