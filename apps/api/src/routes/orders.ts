import { Router } from 'express';
import { authMiddleware } from '../auth/jwt';
import Order from '../db/models/Order';
import Product from '../db/models/Product';
import { cartStore } from './cart';

const router = Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  const userId = (req as any).userId;
  const bodyItems = (req.body.items || []) as Array<{ productId: string; qty: number }>;
  if (!bodyItems.length) {
    return res.status(400).json({ message: '缺少商品' });
  }
  const productDocs = await Product.find({ _id: { $in: bodyItems.map((item) => item.productId) } }).lean();
  const orderItems = bodyItems.map((item) => {
    const product = productDocs.find((p) => String(p._id) === item.productId);
    return {
      productId: item.productId,
      qty: item.qty,
      priceSnapshot: product?.price || 0
    };
  });
  const amount = orderItems.reduce((sum, item) => sum + item.priceSnapshot * item.qty, 0);
  const order = await Order.create({
    userId,
    items: orderItems,
    amount,
    status: 'paid',
    address: req.body.address,
    payment: { method: 'mock', txnId: `MOCK-${Date.now()}` }
  });
  cartStore.set(userId, []);
  res.json(order);
});

router.get('/me', async (req, res) => {
  const userId = (req as any).userId;
  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
  const productIds = new Set<string>();
  orders.forEach((order) => order.items.forEach((item: any) => productIds.add(String(item.productId))));
  const products = await Product.find({ _id: { $in: Array.from(productIds) } }).lean();
  const productMap = new Map(products.map((p) => [String(p._id), p]));
  const enriched = orders.map((order) => ({
    ...order,
    items: order.items.map((item: any) => ({
      ...item,
      product: productMap.get(String(item.productId))
    }))
  }));
  res.json({ data: enriched });
});

export default router;
