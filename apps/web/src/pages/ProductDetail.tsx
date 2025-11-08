import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJSON } from '../lib/api';
import MacroBar from '../components/MacroBar';
import Skeleton from '../components/Skeleton';
import useAppStore from '../lib/store';
import { formatCurrency } from '../lib/utils';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const cart = useAppStore((state) => state.cart);

  useEffect(() => {
    if (!id) return;
    fetchJSON<any>(`products/${id}`)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-slate-500 mt-10">商品不存在或已下架。</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={product.title}
          className="h-64 w-full object-cover"
        />
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-slate-800">{product.title}</h1>
            <p className="text-brand-dark text-lg font-bold">{formatCurrency(product.price)}</p>
            <p className="text-xs text-slate-500">库存 {product.stock} · 单位 {product.unit}</p>
          </div>
          <MacroBar
            protein={product.proteinG}
            fat={product.fatG}
            carb={product.carbG}
            calories={product.caloriesPerUnit}
          />
          <button className="btn-primary w-full" onClick={() => cart.add(product)}>
            加入购物车
          </button>
        </div>
      </div>

      <section className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800">主要食材</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
          {product.ingredients?.map((item: string) => (
            <li key={item} className="px-2 py-1 rounded-full bg-slate-100">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800">相似推荐</h2>
        <div className="mt-3 space-y-3">
          {product.similar?.map((item: any) => (
            <Link key={item._id} to={`/products/${item._id}`} className="flex justify-between text-sm text-slate-600">
              <span>{item.title}</span>
              <span>{formatCurrency(item.price)}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
