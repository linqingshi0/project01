import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';
import { connectMongo } from './db/connect';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import recipeRoutes from './routes/recipes';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import merchantRoutes from './routes/merchants';
import adminRoutes from './routes/admin';
import aiRoutes from './routes/ai';

async function bootstrap() {
  await connectMongo();

  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(morgan('dev'));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/recipes', recipeRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/merchants', merchantRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/ai', aiRoutes);

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: err.message || '服务器错误' });
  });

  app.listen(config.port, () => {
    console.log(`API server listening on port ${config.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('启动失败', error);
  process.exit(1);
});
