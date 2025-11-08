import config from '../../config';
import { calcMacro } from '../../utils/calc';
import { findRecommendedProducts, mapMealsToProducts } from '../mapping/products';

interface GenerateParams {
  gender: string;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  periodWeeks: number;
  activity: string;
  dietPref: string[];
  allergies: string[];
  budgetPerDay: number;
  cuisines: string[];
  days: number;
  mealsPerDay: number;
}

interface RecipePlan {
  totalCalories: number;
  macro: { proteinG: number; fatG: number; carbG: number };
  days: any[];
}

const FALLBACK_TEMPLATES = [
  { title: '香煎鸡胸配彩蔬', description: '鸡胸低脂煎制，搭配杂蔬', keywords: ['鸡胸', '沙拉', '低脂'] },
  { title: '牛油果三文鱼沙拉', description: 'Omega-3 丰富，冷盘搭配生菜', keywords: ['三文鱼', '沙拉'] },
  { title: '藜麦牛肉碗', description: '藜麦与瘦牛肉，复合碳水', keywords: ['藜麦', '牛肉'] },
  { title: '虾仁全麦意面', description: '全麦意面搭配虾仁', keywords: ['虾仁', '意面'] },
  { title: '豆腐蔬菜煲', description: '豆腐蛋白，菌菇蔬菜煲', keywords: ['豆腐', '素食'] }
];

function buildFallbackPlan(params: GenerateParams): RecipePlan {
  const macro = calcMacro(params.gender, params.weightKg, params.heightCm, params.age, params.activity, 0.2);
  const mealsPerDay = params.mealsPerDay || 3;
  const dailyCalories = Math.round(macro.calories / mealsPerDay);
  const dailyProtein = Math.max(15, Math.round(macro.proteinG / mealsPerDay));
  const dailyFat = Math.max(5, Math.round(macro.fatG / mealsPerDay));
  const dailyCarb = Math.max(20, Math.round(macro.carbG / mealsPerDay));
  const now = new Date();
  const days = Array.from({ length: params.days || 7 }, (_, dayIndex) => {
    const date = new Date(now);
    date.setDate(now.getDate() + dayIndex);
    const meals = Array.from({ length: mealsPerDay }, (_, mealIndex) => {
      const template = FALLBACK_TEMPLATES[(dayIndex + mealIndex) % FALLBACK_TEMPLATES.length];
      const mealNames = ['早餐', '上午加餐', '午餐', '下午茶', '晚餐'];
      return {
        name: mealNames[mealIndex % mealNames.length],
        items: [
          {
            title: template.title,
            description: template.description,
            qty: 1,
            unit: '份',
            calories: dailyCalories,
            proteinG: dailyProtein,
            fatG: dailyFat,
            carbG: dailyCarb
          }
        ]
      };
    });
    return { date, meals };
  });

  return {
    totalCalories: macro.calories,
    macro: { proteinG: macro.proteinG, fatG: macro.fatG, carbG: macro.carbG },
    days
  };
}

async function callOpenAI(params: GenerateParams, prompt: string) {
  if (!config.openaiKey) return null;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          { role: 'system', content: '你是专业营养师与健身教练。' },
          { role: 'user', content: prompt }
        ]
      })
    });
    if (!response.ok) {
      throw new Error(`OpenAI error ${response.status}`);
    }
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) return null;
    const jsonText = text.replace(/^```json|```$/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.warn('OpenAI 调用失败，使用回退方案', error);
    return null;
  }
}

export async function generateRecipe(params: GenerateParams) {
  const macro = calcMacro(params.gender, params.weightKg, params.heightCm, params.age, params.activity, 0.2);
  const prompt = `你是专业营养师与健身教练。基于给定用户画像，生成为期 ${
    params.days
  } 天、每天 ${params.mealsPerDay} 餐的减脂食谱：\n- 每日总能量 ≈ ${macro.calories} kcal（±5%），并给出每日总 P/F/C（克）。\n- 每餐给中文菜名、主要食材（含克数）、做法要点（≤60字）。\n- 避免：${params.allergies.join('、') || '无'}；偏好：${
    params.dietPref.join('、') || '清淡'
  }；预算：≤ ¥${params.budgetPerDay}/天；口味在 ${params.cuisines.join('、') || '多种'} 内多样化。\n- 输出严格 JSON（无需多余解释），结构见示例。`;

  let plan = await callOpenAI(params, prompt);
  if (!plan) {
    plan = buildFallbackPlan(params);
  }

  const enrichedDays = await Promise.all(
    plan.days.map(async (day: any) => ({
      ...day,
      meals: await mapMealsToProducts(day.meals)
    }))
  );

  const recommendedProducts = await findRecommendedProducts(params.dietPref);

  return {
    totalCalories: plan.totalCalories || macro.calories,
    macro: plan.macro || { proteinG: macro.proteinG, fatG: macro.fatG, carbG: macro.carbG },
    days: enrichedDays,
    recommendedProducts
  };
}
