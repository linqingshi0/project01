import { useState } from 'react';
import { fetchJSON } from '../lib/api';
import useAppStore from '../lib/store';

const defaultForm = {
  name: '清食轻餐示例店',
  contact: '13800000000',
  address: '上海市浦东新区 XX 路 88 号',
  licenseImgs: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80']
};

export default function MerchantOnboard() {
  const [form, setForm] = useState(defaultForm);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useAppStore((state) => state.toast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchJSON<any>('merchants/apply', { method: 'POST', data: form });
      setStatus(res.status);
      toast.show({ title: '提交成功', description: `当前状态：${res.status}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">商家入驻申请</h1>
      <form className="bg-white rounded-3xl p-6 shadow-sm space-y-4" onSubmit={handleSubmit}>
        <Field label="商家名称">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </Field>
        <Field label="联系方式">
          <input
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </Field>
        <Field label="门店地址">
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </Field>
        <Field label="许可证图片 URL">
          <textarea
            value={form.licenseImgs.join('\n')}
            onChange={(e) => setForm({ ...form, licenseImgs: e.target.value.split('\n').filter(Boolean) })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </Field>
        <button className="btn-primary w-full" type="submit" disabled={loading}>
          {loading ? '提交中...' : '提交申请'}
        </button>
      </form>
      {status && (
        <div className="bg-white rounded-3xl p-6 shadow-sm text-sm text-slate-600">
          当前审核状态：<span className="font-semibold text-brand-dark">{status}</span>
        </div>
      )}
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
