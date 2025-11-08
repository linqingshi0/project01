interface Props {
  protein: number;
  fat: number;
  carb: number;
  calories: number;
}

export default function MacroBar({ protein, fat, carb, calories }: Props) {
  const total = protein + fat + carb || 1;
  const ratio = {
    protein: Math.round((protein / total) * 100),
    fat: Math.round((fat / total) * 100),
    carb: Math.round((carb / total) * 100)
  };

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>热量 {calories} kcal</span>
        <span>
          P/F/C {ratio.protein}%/{ratio.fat}%/{ratio.carb}%
        </span>
      </div>
      <div className="mt-1 h-2.5 w-full rounded-full bg-slate-200 overflow-hidden" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={100}>
        <div className="h-full bg-emerald-500" style={{ width: `${ratio.protein}%` }} aria-hidden />
        <div className="h-full bg-orange-400 -mt-2.5" style={{ width: `${ratio.fat}%` }} aria-hidden />
        <div className="h-full bg-sky-400 -mt-2.5" style={{ width: `${ratio.carb}%` }} aria-hidden />
      </div>
    </div>
  );
}
