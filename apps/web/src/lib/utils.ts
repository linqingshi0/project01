import clsx from 'clsx';

export function cn(...inputs: any[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number) {
  return `¥${value.toFixed(2)}`;
}

export function sum(arr: number[]) {
  return arr.reduce((acc, cur) => acc + cur, 0);
}
