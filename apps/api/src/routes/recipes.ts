import { Router } from 'express';
import Recipe from '../db/models/Recipe';
import Product from '../db/models/Product';
import { authMiddleware } from '../auth/jwt';

const router = Router();

router.get('/me', authMiddleware, async (req, res) => {
  const userId = (req as any).userId;
  const recipes = await Recipe.find({ userId }).sort({ createdAt: -1 }).lean();
  res.json(recipes);
});

router.get('/:id', authMiddleware, async (req, res) => {
  const userId = (req as any).userId;
  const recipe = await Recipe.findOne({ _id: req.params.id, userId }).lean();
  if (!recipe) {
    return res.status(404).json({ message: '食谱不存在' });
  }
  const productIds = new Set<string>();
  recipe.days.forEach((day: any) => {
    day.meals.forEach((meal: any) => {
      meal.items.forEach((item: any) => {
        if (item.productId) productIds.add(String(item.productId));
      });
    });
  });
  const products = await Product.find({ _id: { $in: Array.from(productIds) } }).lean();
  const productMap = new Map(products.map((p) => [String(p._id), p]));
  const hydratedDays = recipe.days.map((day: any) => ({
    ...day,
    meals: day.meals.map((meal: any) => ({
      ...meal,
      items: meal.items.map((item: any) => ({
        ...item,
        product: item.productId ? productMap.get(String(item.productId)) : null
      }))
    }))
  }));

  const recommendedProducts = products.slice(0, 6);
  res.json({ ...recipe, days: hydratedDays, recommendedProducts });
});

export default router;
