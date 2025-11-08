import { useEffect, useState } from 'react';
import { fetchJSON } from '../lib/api';
import useAppStore from '../lib/store';

const emptyProduct = {
  title: '',
  price: 19.9,
  unit: '份',
  stock: 100,
  caloriesPerUnit: 320,
  proteinG: 25,
  fatG: 10,
  carbG: 35,
  tags: ['轻食'],
  images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'],
  ingredients: ['鸡胸肉', '蔬菜沙拉']
};

export default function MerchantProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);
  const toast = useAppStore((state) => state.toast);

  const loadProducts = () => {
    fetchJSON<any>('merchants/me/products').then((res) => setProducts(res.products || res));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchJSON('merchants/products', { method: 'POST', data: form });
      toast.show({ title: '商品已创建' });
      setForm(emptyProduct);
      loadProducts();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">商品管理</h1>
        <p className="text-sm text-slate-500">新增 / 管理轻食商品，一键同步到用户端。</p>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">新增商品</h2>
        <form className="grid sm:grid-cols-2 gap-4 text-sm" onSubmit={handleSubmit}>
          <Field label="名称">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              required
            />
          </Field>
          <Field label="价格">
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              required
            />
          </Field>
          <Field label="库存">
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </Field>
          <Field label="标签">
            <input
              value={form.tags.join(',')}
              onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').filter(Boolean) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </Field>
          <Field label="图片 URL">
            <input
              value={form.images[0]}
              onChange={(e) => setForm({ ...form, images: [e.target.value] })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </Field>
          <Field label="食材">
            <input
              value={form.ingredients.join(',')}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value.split(',').filter(Boolean) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </Field>
          <div className="sm:col-span-2">
            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? '保存中...' : '新增商品'}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">商品列表</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {products.map((product) => (
            <li key={product._id} className="flex items-center justify-between">
              <span>{product.title}</span>
              <span>{product.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm text-slate-600">
      <span className="mb-2 inline-block font-medium">{label}</span>
      {children}
    </label>
  );
}
