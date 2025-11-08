import { Router } from 'express';
import { authMiddleware } from '../auth/jwt';
import Merchant from '../db/models/Merchant';
import { seedSampleData } from '../services/adminHelpers';
import { setAutoApprove, isAutoApproveEnabled } from '../services/settings';

const router = Router();

router.use(authMiddleware);

router.get('/merchants', async (_req, res) => {
  const merchants = await Merchant.find({ status: 'pending' }).lean();
  res.json({ merchants });
});

router.get('/settings', (_req, res) => {
  res.json({ autoApprove: isAutoApproveEnabled() });
});

router.post('/review-merchant', async (req, res) => {
  const { merchantId, status } = req.body;
  if (!merchantId || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: '参数错误' });
  }
  const merchant = await Merchant.findByIdAndUpdate(merchantId, { status }, { new: true });
  res.json(merchant);
});

router.post('/bootstrap', async (_req, res) => {
  await seedSampleData();
  res.json({ ok: true });
});

router.post('/settings', async (req, res) => {
  if (typeof req.body.autoApprove === 'boolean') {
    setAutoApprove(req.body.autoApprove);
  }
  res.json({ autoApprove: isAutoApproveEnabled() });
});

export default router;
