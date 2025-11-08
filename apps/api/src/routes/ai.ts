import { Router } from 'express';
import { authMiddleware } from '../auth/jwt';
import { generateRecipe } from '../services/ai/generate';
import Recipe from '../db/models/Recipe';

const router = Router();

router.post('/generate-recipe', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const params = req.body;
    const plan = await generateRecipe(params);

    const sanitizedDays = plan.days.map((day: any) => ({
      date: day.date ? new Date(day.date) : new Date(),
      meals: day.meals.map((meal: any) => ({
        name: meal.name,
        items: meal.items.map((item: any) => ({
          productId: item.productId || null,
          title: item.title,
          qty: item.qty || 1,
          unit: item.unit || '份',
          calories: item.calories,
          proteinG: item.proteinG,
          fatG: item.fatG,
          carbG: item.carbG,
          description: item.description,
          externalUrl: item.externalUrl || null
        }))
      }))
    }));

    const recipe = await Recipe.create({
      userId,
      dateRange: {
        start: sanitizedDays[0]?.date || new Date(),
        end: sanitizedDays[sanitizedDays.length - 1]?.date || new Date()
      },
      totalCalories: plan.totalCalories,
      macro: plan.macro,
      days: sanitizedDays,
      createdFrom: {
        prompt: 'AI 生成食谱',
        params
      }
    });

    res.json({ recipeId: recipe._id, recommendedProducts: plan.recommendedProducts });
  } catch (error: any) {
    console.error('生成食谱失败', error);
    res.status(500).json({ message: error.message || '生成食谱失败' });
  }
});

export default router;
