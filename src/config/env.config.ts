import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'dfg5sdf4s65df465sdf546',
  STAGE: process.env.STAGE || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/express-template'
};
