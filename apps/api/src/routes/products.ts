import { Router } from 'express';
import Product from '../db/models/Product';
import { getPagination } from '../utils/paginate';

const router = Router();

router.get('/', async (req, res) => {
  const { skip, limit } = getPagination(req);
  const query: any = { status: 'on' };
  if (req.query.tag) {
    query.tags = { $in: Array.isArray(req.query.tag) ? req.query.tag : [req.query.tag] };
  }
  if (req.query.q) {
    query.title = { $regex: req.query.q, $options: 'i' };
  }
  const data = await Product.find(query).skip(skip).limit(limit).lean();
  const total = await Product.countDocuments(query);
  res.json({ data, total, page: Math.floor(skip / limit) + 1 });
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) {
    return res.status(404).json({ message: '商品不存在' });
  }
  const similar = await Product.find({
    _id: { $ne: product._id },
    status: 'on',
    tags: { $in: product.tags || [] }
  })
    .limit(5)
    .lean();
  res.json({ ...product, similar });
});

export default router;
