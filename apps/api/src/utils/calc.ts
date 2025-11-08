export interface MacroResult {
  calories: number;
  proteinG: number;
  fatG: number;
  carbG: number;
}

export function calcBmr(gender: string, weightKg: number, heightCm: number, age: number) {
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

export function activityFactor(level: string) {
  switch (level) {
    case 'sedentary':
      return 1.2;
    case 'light':
      return 1.375;
    case 'moderate':
      return 1.55;
    case 'active':
      return 1.725;
    default:
      return 1.375;
  }
}

export function calcMacro(
  gender: string,
  weightKg: number,
  heightCm: number,
  age: number,
  activity: string,
  deficitRatio = 0.2
): MacroResult {
  const bmr = calcBmr(gender, weightKg, heightCm, age);
  const tdee = bmr * activityFactor(activity);
  const calories = Math.round(tdee * (1 - deficitRatio));
  const proteinG = Math.round(weightKg * 1.8);
  const proteinCalories = proteinG * 4;
  const fatCalories = Math.round(calories * 0.25);
  const fatG = Math.round(fatCalories / 9);
  const carbCalories = calories - proteinCalories - fatCalories;
  const carbG = Math.max(0, Math.round(carbCalories / 4));
  return { calories, proteinG, fatG, carbG };
}
