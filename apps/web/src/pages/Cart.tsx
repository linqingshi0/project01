import { Link, useNavigate } from 'react-router-dom';
import useAppStore from '../lib/store';
import { formatCurrency } from '../lib/utils';

export default function Cart() {
  const cart = useAppStore((state) => state.cart);
  const navigate = useNavigate();
  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">购物车</h1>
      {cart.items.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center text-sm text-slate-500">
          购物车为空，去<Link to="/">挑选商品</Link>吧。
        </div>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.productId} className="bg-white rounded-3xl p-5 shadow-sm flex gap-4">
              <img
                src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                alt={item.product?.title || '轻食商品'}
                className="h-24 w-24 object-cover rounded-2xl"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.product?.title || '商品已下架'}</h3>
                    {item.product && (
                      <p className="text-xs text-slate-500 mt-1">
                        {formatCurrency(item.product.price)} / {item.product.unit}
                      </p>
                    )}
                  </div>
                  <button className="text-xs text-red-500" onClick={() => cart.remove(item.productId)}>
                    移除
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm">
                  <label className="text-slate-500">数量</label>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => cart.updateQty(item.productId, Number(e.target.value))}
                    className="w-20 rounded-lg border border-slate-200 px-2 py-1"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="bg-white rounded-3xl p-6 shadow-sm flex justify-between items-center">
            <span className="text-sm text-slate-600">合计</span>
            <span className="text-lg font-semibold text-brand-dark">{formatCurrency(total)}</span>
          </div>
          <button className="btn-primary w-full" onClick={() => navigate('/checkout')}>
            去结算
          </button>
        </div>
      )}
    </div>
  );
}
