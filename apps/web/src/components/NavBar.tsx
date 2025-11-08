import { Link, useLocation } from 'react-router-dom';
import useAppStore from '../lib/store';
import { logout } from '../lib/auth';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/recipes/new', label: 'AI 食谱' },
  { to: '/cart', label: '购物车' },
  { to: '/profile', label: '我的' }
];

export default function NavBar() {
  const { auth } = useAppStore();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-brand-dark">
          LightEats
        </Link>
        <nav className="flex gap-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-2 py-1 rounded-full transition-colors ${
                location.pathname === item.to ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm text-slate-600 flex items-center gap-3">
          {auth.user ? (
            <>
              <span className="hidden sm:block">{auth.user.name || auth.user.email}</span>
              <button onClick={logout} className="text-brand-dark hover:text-brand">
                退出
              </button>
            </>
          ) : (
            <Link to="/profile" className="text-brand-dark">
              登录/注册
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
