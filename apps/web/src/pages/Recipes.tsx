import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAppStore from '../lib/store';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

export default function Recipes() {
  const list = useAppStore((state) => state.recipes.list);
  const fetchMine = useAppStore((state) => state.recipes.fetchMine);
  const loading = list.length === 0;

  useEffect(() => {
    fetchMine().catch(() => undefined);
  }, [fetchMine]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">我的 AI 食谱</h1>
      {list.length === 0 ? (
        <EmptyState
          title="暂未生成食谱"
          description="去首页尝试 AI 生成轻食方案吧"
          action={<Link to="/recipes/new" className="btn-primary">立即生成</Link>}
        />
      ) : (
        <div className="space-y-3">
          {list.map((recipe) => (
            <Link
              key={recipe._id}
              to={`/recipes/${recipe._id}`}
              className="block bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:border-brand"
            >
              <div className="flex justify-between text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-800">{recipe.createdFrom?.prompt || 'AI 食谱'}</p>
                  <p className="mt-1 text-xs">热量 {recipe.totalCalories} kcal · 蛋白质 {recipe.macro?.proteinG}g</p>
                </div>
                <span className="text-xs text-slate-400">{new Date(recipe.createdAt).toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
