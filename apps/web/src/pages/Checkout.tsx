import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../lib/store';
import { fetchJSON } from '../lib/api';
import { formatCurrency } from '../lib/utils';

export default function Checkout() {
  const cart = useAppStore((state) => state.cart);
  const { auth, toast } = useAppStore.getState();
  const navigate = useNavigate();
  const [address, setAddress] = useState('北京市海淀区 AI 科技园 18 号');
  const [loading, setLoading] = useState(false);
  const amount = cart.items.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.qty;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchJSON<any>('orders', {
        method: 'POST',
        data: {
          items: cart.items.map((item) => ({ productId: item.productId, qty: item.qty })),
          address
        }
      });
      toast.show({ title: '支付成功', description: `订单号 ${data._id}` });
      cart.clear();
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  if (!auth.token) {
    return <p className="text-center text-slate-500 mt-10">请先登录后再下单。</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">订单结算</h1>
      <form className="bg-white rounded-3xl p-6 shadow-sm space-y-4" onSubmit={handleSubmit}>
        <div className="text-sm text-slate-600 space-y-1">
          <p>共 {cart.items.length} 件商品</p>
          <p>金额 {formatCurrency(amount)}</p>
        </div>
        <label className="block text-sm text-slate-600">
          <span className="mb-2 inline-block font-medium">收货地址</span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <button className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? '模拟支付中...' : '模拟支付并下单'}
        </button>
      </form>
    </div>
  );
}
