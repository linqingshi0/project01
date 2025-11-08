import { Router } from 'express';
import { authMiddleware } from '../auth/jwt';
import Merchant from '../db/models/Merchant';
import Product from '../db/models/Product';
import Order from '../db/models/Order';
import { isAutoApproveEnabled } from '../services/settings';

const router = Router();

router.post('/apply', authMiddleware, async (req, res) => {
  const userId = (req as any).userId;
  const payload = req.body;
  let merchant = await Merchant.findOne({ ownerUserId: userId });
  if (!merchant) {
    merchant = new Merchant({ ...payload, ownerUserId: userId });
  } else {
    merchant.set(payload);
  }
  if (isAutoApproveEnabled()) {
    merchant.status = 'approved';
  }
  await merchant.save();
  res.json(merchant);
});

router.get('/me/products', authMiddleware, async (req, res) => {
  const userId = (req as any).userId;
  const merchant = await Merchant.findOne({ ownerUserId: userId });
  if (!merchant) {
    return res.json({ products: [] });
  }
  const products = await Product.find({ merchantId: merchant._id }).lean();
  res.json({ products });
});

router.post('/products', authMiddleware, async (req, res) => {
  const userId = (req as any).userId;
  const merchant = await Merchant.findOne({ ownerUserId: userId, status: 'approved' });
  if (!merchant) {
    return res.status(403).json({ message: '商家未审核通过' });
  }
  const product = await Product.create({ ...req.body, merchantId: merchant._id, status: 'on' });
  res.json(product);
});

router.patch('/products/:id', authMiddleware, async (req, res) => {
  const userId = (req as any).userId;
  const merchant = await Merchant.findOne({ ownerUserId: userId });
  if (!merchant) {
    return res.status(403).json({ message: '商家不存在' });
  }
  const product = await Product.findOneAndUpdate({ _id: req.params.id, merchantId: merchant._id }, req.body, {
    new: true
  });
  res.json(product);
});

router.get('/me/orders', authMiddleware, async (req, res) => {
  const userId = (req as any).userId;
  const merchant = await Merchant.findOne({ ownerUserId: userId });
  if (!merchant) {
    return res.json({ orders: [] });
  }
  const products = await Product.find({ merchantId: merchant._id }).lean();
  const productIds = products.map((p) => String(p._id));
  const orders = await Order.find({ 'items.productId': { $in: productIds } })
    .sort({ createdAt: -1 })
    .lean();
  const productMap = new Map(products.map((p) => [String(p._id), p]));
  const enriched = orders.map((order) => ({
    ...order,
    items: order.items.map((item: any) => ({
      ...item,
      product: productMap.get(String(item.productId))
    }))
  }));
  res.json({ orders: enriched });
});

export default router;
