import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchJSON } from '../lib/api';
import MacroBar from '../components/MacroBar';
import Skeleton from '../components/Skeleton';
import { formatCurrency } from '../lib/utils';
import useAppStore from '../lib/store';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const cart = useAppStore((state) => state.cart);

  useEffect(() => {
    if (!id) return;
    fetchJSON<any>(`recipes/${id}`)
      .then(setRecipe)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!recipe) {
    return <p className="text-center text-slate-500 mt-10">食谱不存在或已删除。</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <header className="bg-white p-6 rounded-3xl shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">个性化减脂方案</h1>
        <p className="mt-2 text-sm text-slate-500">
          周期 {recipe.days.length} 天，总热量 {recipe.totalCalories} kcal
        </p>
        <div className="mt-4">
          <MacroBar
            protein={recipe.macro.proteinG}
            fat={recipe.macro.fatG}
            carb={recipe.macro.carbG}
            calories={recipe.totalCalories}
          />
        </div>
      </header>

      <div className="space-y-4">
        {recipe.days.map((day: any) => (
          <div key={day.date} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-800">
              {new Date(day.date).toLocaleDateString('zh-CN', { weekday: 'long', month: 'numeric', day: 'numeric' })}
            </h2>
            {day.meals.map((meal: any) => (
              <div key={meal.name} className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-700">{meal.name}</h3>
                  <span className="text-xs text-slate-400">
                    热量 {meal.items.reduce((sum: number, item: any) => sum + (item.calories || 0), 0)} kcal
                  </span>
                </div>
                <ul className="space-y-3">
                  {meal.items.map((item: any, idx: number) => (
                    <li key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.description || ''}</p>
                        <p className="text-xs text-slate-400">
                          P/F/C {item.proteinG}g / {item.fatG}g / {item.carbG}g
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.productId && item.product ? (
                          <button
                            className="btn-primary"
                            onClick={() => cart.add(item.product, 1)}
                          >
                            加入购物车
                          </button>
                        ) : item.externalUrl ? (
                          <a href={item.externalUrl} className="btn-primary" target="_blank" rel="noreferrer">
                            查看外部商品
                          </a>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      <aside className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
        <h3 className="text-lg font-semibold text-slate-800">推荐商品</h3>
        <ul className="space-y-3 text-sm text-slate-600">
          {recipe.recommendedProducts?.map((product: any) => (
            <li key={product._id} className="flex items-center justify-between">
              <Link to={`/products/${product._id}`} className="text-brand-dark">
                {product.title}
              </Link>
              <span>{formatCurrency(product.price)}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
