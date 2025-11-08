import { useEffect, useState } from 'react';
import { fetchJSON } from '../lib/api';

export default function AdminPanel() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [autoApprove, setAutoApprove] = useState(true);

  const load = () => {
    fetchJSON<any>('admin/merchants').then((res) => setMerchants(res.merchants || res));
  };

  useEffect(() => {
    load();
    fetchJSON<{ autoApprove: boolean }>('admin/settings').then((res) => {
      if (typeof res.autoApprove === 'boolean') {
        setAutoApprove(res.autoApprove);
      }
    });
  }, []);

  const handleApprove = (id: string, status: 'approved' | 'rejected') => {
    fetchJSON('admin/review-merchant', { method: 'POST', data: { merchantId: id, status } }).then(load);
  };

  const toggleAutoApprove = () => {
    const next = !autoApprove;
    setAutoApprove(next);
    fetchJSON<{ autoApprove: boolean }>('admin/settings', { method: 'POST', data: { autoApprove: next } })
      .then((res) => {
        if (typeof res.autoApprove === 'boolean') {
          setAutoApprove(res.autoApprove);
        }
      })
      .catch(() => undefined);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">管理后台</h1>
        <p className="text-sm text-slate-500">审核商家、维护类目标签以及控制 AI 回退策略。</p>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-600">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={autoApprove} onChange={toggleAutoApprove} /> 自动审核
          </label>
          <button className="btn-primary" onClick={() => fetchJSON('admin/bootstrap', { method: 'POST' }).then(load)}>
            初始化示例数据
          </button>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">商家审核</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          {merchants.length === 0 ? (
            <p>暂无待审核商家</p>
          ) : (
            merchants.map((merchant) => (
              <div key={merchant._id} className="border border-slate-200 rounded-2xl p-4 flex justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{merchant.name}</p>
                  <p className="text-xs text-slate-500">{merchant.contact} · {merchant.address}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary" onClick={() => handleApprove(merchant._id, 'approved')}>
                    通过
                  </button>
                  <button
                    className="btn-primary bg-red-500 hover:bg-red-600"
                    onClick={() => handleApprove(merchant._id, 'rejected')}
                  >
                    拒绝
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
