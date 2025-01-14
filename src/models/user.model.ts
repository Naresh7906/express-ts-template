import mongoose, { Document, Schema } from 'mongoose';
import { logger } from '../utils/logger.util';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Log user creation
userSchema.post('save', function(doc) {
  logger.info(`New user created: ${doc.email}`);
});

export const User = mongoose.model<IUser>('User', userSchema); 