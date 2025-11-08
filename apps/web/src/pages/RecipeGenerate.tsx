import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJSON } from '../lib/api';
import useAppStore from '../lib/store';

const defaultForm = {
  gender: 'female',
  age: 26,
  heightCm: 165,
  weightKg: 58,
  targetWeightKg: 52,
  periodWeeks: 6,
  activity: 'light',
  dietPref: ['低脂'],
  allergies: [],
  budgetPerDay: 45,
  cuisines: ['中式'],
  days: 7,
  mealsPerDay: 4
};

export default function RecipeGenerate() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast, recipes } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchJSON<{ recipeId: string }>('ai/generate-recipe', {
        method: 'POST',
        data: form
      });
      toast.show({ title: '生成成功', description: '食谱已保存至我的食谱' });
      await recipes.fetchMine();
      navigate(`/recipes/${data.recipeId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-xl font-semibold text-slate-800 mb-6">AI 个性化食谱</h1>
      <form className="space-y-6 bg-white rounded-3xl p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <Field label="性别">
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              <option value="female">女性</option>
              <option value="male">男性</option>
            </select>
          </Field>
          <Field label="年龄">
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </Field>
          <Field label="身高 (cm)">
            <input
              type="number"
              value={form.heightCm}
              onChange={(e) => setForm({ ...form, heightCm: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </Field>
          <Field label="体重 (kg)">
            <input
              type="number"
              value={form.weightKg}
              onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </Field>
          <Field label="目标体重 (kg)">
            <input
              type="number"
              value={form.targetWeightKg}
              onChange={(e) => setForm({ ...form, targetWeightKg: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </Field>
          <Field label="计划周期 (周)">
            <input
              type="number"
              value={form.periodWeeks}
              onChange={(e) => setForm({ ...form, periodWeeks: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </Field>
          <Field label="活动水平">
            <select
              value={form.activity}
              onChange={(e) => setForm({ ...form, activity: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              <option value="sedentary">久坐</option>
              <option value="light">轻度</option>
              <option value="moderate">中度</option>
              <option value="active">高强度</option>
            </select>
          </Field>
          <Field label="每日预算 (¥)">
            <input
              type="number"
              value={form.budgetPerDay}
              onChange={(e) => setForm({ ...form, budgetPerDay: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </Field>
          <Field label="食谱天数">
            <input
              type="number"
              value={form.days}
              onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </Field>
          <Field label="每日餐次">
            <input
              type="number"
              value={form.mealsPerDay}
              onChange={(e) => setForm({ ...form, mealsPerDay: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </Field>
        </div>
        <Field label="饮食偏好">
          <input
            value={form.dietPref.join(',')}
            onChange={(e) => setForm({ ...form, dietPref: e.target.value.split(',').map((item) => item.trim()) })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="逗号分隔，例如：低脂,高蛋白"
          />
        </Field>
        <Field label="过敏/忌口">
          <input
            value={form.allergies.join(',')}
            onChange={(e) => setForm({ ...form, allergies: e.target.value.split(',').filter(Boolean) })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="逗号分隔，例如：花生,芹菜"
          />
        </Field>
        <Field label="口味/菜系">
          <input
            value={form.cuisines.join(',')}
            onChange={(e) => setForm({ ...form, cuisines: e.target.value.split(',').filter(Boolean) })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="逗号分隔，例如：中式,日式"
          />
        </Field>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? '生成中...' : '生成我的食谱'}
        </button>
      </form>
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
