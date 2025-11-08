import { useEffect, useState } from 'react';
import { fetchJSON } from '../lib/api';
import { formatCurrency } from '../lib/utils';

export default function MerchantOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchJSON<any>('merchants/me/orders').then((res) => setOrders(res.orders || res));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">订单管理</h1>
      <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4 text-sm text-slate-600">
        {orders.length === 0 ? (
          <p>暂无订单</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border border-slate-200 rounded-2xl p-4">
              <div className="flex justify-between">
                <span>订单号 {order._id}</span>
                <span>{formatCurrency(order.amount)}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">状态 {order.status}</p>
              <ul className="mt-2 space-y-1">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx} className="flex justify-between text-xs">
                    <span>{item.product?.title || item.productId}</span>
                    <span>x{item.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
