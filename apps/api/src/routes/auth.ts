import { Router } from 'express';
import User from '../db/models/User';
import { signToken, authMiddleware } from '../auth/jwt';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({ message: '邮箱必填' });
  }
  const normalized = String(email).toLowerCase();
  let user = await User.findOne({ email: normalized });
  if (!user) {
    user = await User.create({ email: normalized, name: name || normalized.split('@')[0] });
  } else if (name && !user.name) {
    user.name = name;
    await user.save();
  }
  const token = signToken({ userId: user._id.toString() });
  return res.json({ token, user });
});

router.get('/me', authMiddleware, async (req, res) => {
  const userId = (req as any).userId;
  const user = await User.findById(userId);
  return res.json(user);
});

export default router;
