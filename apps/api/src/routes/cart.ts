import { Router } from 'express';
import { authMiddleware } from '../auth/jwt';
import Product from '../db/models/Product';

const router = Router();
export const cartStore = new Map<string, { productId: string; qty: number }[]>();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const userId = (req as any).userId;
  const items = cartStore.get(userId) || [];
  const products = await Product.find({ _id: { $in: items.map((item) => item.productId) } }).lean();
  const data = items.map((item) => ({
    ...item,
    product: products.find((p) => String(p._id) === item.productId)
  }));
  res.json({ items: data });
});

router.post('/', async (req, res) => {
  const userId = (req as any).userId;
  const items = (req.body.items || []).filter((item: any) => item.productId);
  cartStore.set(userId, items);
  res.json({ ok: true });
});

export default router;
