import { useEffect, useState } from 'react';
import useAppStore from '../lib/store';
import { login } from '../lib/auth';
import { fetchJSON } from '../lib/api';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';

export default function Profile() {
  const auth = useAppStore((state) => state.auth);
  const recipeList = useAppStore((state) => state.recipes.list);
  const fetchRecipes = useAppStore((state) => state.recipes.fetchMine);
  const [email, setEmail] = useState('demo@lighteats.io');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.token) return;
    fetchJSON<any>('orders/me').then((res) => setOrders(res.data || res));
    fetchRecipes().catch(() => undefined);
  }, [auth.token, fetchRecipes]);

  if (!auth.token) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 space-y-4">
        <h1 className="text-xl font-semibold text-slate-800">登录 LightEats</h1>
        <form
          className="bg-white rounded-3xl p-6 shadow-sm space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            login({ email }).catch(console.error);
          }}
        >
          <label className="block text-sm text-slate-600">
            <span className="mb-2 inline-block font-medium">邮箱</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <button className="btn-primary w-full" type="submit">
            一键登录（演示）
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">你好，{auth.user?.name || auth.user?.email}</h1>
        <p className="text-sm text-slate-500 mt-2">欢迎回来，查看你的 AI 食谱与订单。</p>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">最近食谱</h2>
          <Link to="/recipes" className="text-sm text-brand-dark">
            查看全部
          </Link>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {recipeList.slice(0, 3).map((recipe) => (
            <li key={recipe._id} className="flex justify-between">
              <Link to={`/recipes/${recipe._id}`} className="text-brand-dark">
                {recipe.createdFrom?.prompt || 'AI 食谱'}
              </Link>
              <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">订单记录</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          {orders.length === 0 ? (
            <p>暂无订单</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="flex justify-between">
                <div>
                  <p className="font-medium">订单号 {order._id}</p>
                  <p className="text-xs text-slate-400">状态 {order.status}</p>
                </div>
                <span>{formatCurrency(order.amount)}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
