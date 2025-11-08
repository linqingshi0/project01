import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: Number(process.env.PORT || 4000),
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/lighteats',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  openaiKey: process.env.OPENAI_API_KEY || '',
  enableAutoMerchantApprove: process.env.ENABLE_AUTO_MERCHANT_APPROVE !== 'false'
};

export default config;
