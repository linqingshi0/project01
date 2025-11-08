import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../lib/api';

export default function MerchantDashboard() {
  const [stats, setStats] = useState<any>({ gmv: 0, orders: 0, topProducts: [] });

  useEffect(() => {
    fetchJSON<any>('merchants/me/orders')
      .then((res) => {
        const orders = res.orders || res;
        const gmv = orders.reduce((sum: number, order: any) => sum + order.amount, 0);
        setStats({
          gmv,
          orders: orders.length,
          topProducts: orders
            .flatMap((order: any) => order.items)
            .slice(0, 5)
        });
      })
      .catch(() => setStats({ gmv: 0, orders: 0, topProducts: [] }));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-3">
        <h1 className="text-xl font-semibold text-slate-800">商家工作台</h1>
        <p className="text-sm text-slate-500">查看 GMV、订单与热销商品概览。</p>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <Stat label="GMV (¥)" value={stats.gmv.toFixed(2)} />
          <Stat label="订单数" value={stats.orders} />
          <Stat label="热销商品数" value={stats.topProducts.length} />
        </div>
      </header>

      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">快捷入口</h2>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
          <Link to="/merchant/products" className="btn-primary text-center">
            商品管理
          </Link>
          <Link to="/merchant/orders" className="btn-primary text-center">
            订单管理
          </Link>
          <Link to="/merchant/onboard" className="btn-primary text-center">
            入驻信息
          </Link>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">热销商品 Top</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {stats.topProducts.length === 0 ? (
            <p>暂无数据</p>
          ) : (
            stats.topProducts.map((item: any, idx: number) => (
              <li key={idx} className="flex justify-between">
                <span>{item.product?.title || item.productId}</span>
                <span>{item.qty} 份</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
