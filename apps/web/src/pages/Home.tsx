import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { fetchJSON } from '../lib/api';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchJSON<{ data: any[] }>('products?limit=6')
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 space-y-10 py-10">
      <section className="bg-gradient-to-r from-brand to-brand-light text-white rounded-3xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold">LightEats · AI 轻食管家</h1>
        <p className="mt-3 text-sm opacity-90">
          输入你的身体指标与目标，AI 即刻生成个性化食谱；一键跳转商品，轻松吃出好身材。
        </p>
        <div className="mt-6 flex gap-3 text-sm">
          <Link to="/recipes/new" className="btn-primary bg-white text-brand-dark">
            立即生成食谱
          </Link>
          <Link to="/merchant/onboard" className="btn-primary">
            商家入驻
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">热门轻食</h2>
          <Link to="/recipes" className="text-sm text-brand-dark">
            查看全部
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-56" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState title="暂无商品" description="请稍后再试或联系管理员" />
        )}
      </section>

      <section className="grid sm:grid-cols-3 gap-4 text-sm text-slate-600">
        <FeatureCard title="AI 个性化">依据目标热量与预算定制每日膳食。</FeatureCard>
        <FeatureCard title="商家联动">一键跳转商品链接，补货轻松。</FeatureCard>
        <FeatureCard title="营养可视化">宏营养素图表，掌握每日摄入。</FeatureCard>
      </section>
    </div>
  );
}

function FeatureCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed">{children}</p>
    </div>
  );
}
