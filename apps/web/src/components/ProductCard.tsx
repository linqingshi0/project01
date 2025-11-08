import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import MacroBar from './MacroBar';

interface Props {
  product: any;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link
      to={`/products/${product._id}`}
      className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <img
        src={product.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
        alt={product.title}
        className="h-40 w-full object-cover"
      />
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">{product.title}</h3>
          <span className="text-brand-dark font-bold text-sm">{formatCurrency(product.price)}</span>
        </div>
        <MacroBar
          protein={product.proteinG}
          fat={product.fatG}
          carb={product.carbG}
          calories={product.caloriesPerUnit}
        />
        <div className="flex flex-wrap gap-1 text-xs text-slate-500">
          {product.tags?.slice(0, 3).map((tag: string) => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
