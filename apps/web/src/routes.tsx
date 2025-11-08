import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const RecipeGenerate = lazy(() => import('./pages/RecipeGenerate'));
const Recipes = lazy(() => import('./pages/Recipes'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const MerchantOnboard = lazy(() => import('./pages/MerchantOnboard'));
const MerchantDashboard = lazy(() => import('./pages/MerchantDashboard'));
const MerchantProducts = lazy(() => import('./pages/MerchantProducts'));
const MerchantOrders = lazy(() => import('./pages/MerchantOrders'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/recipes/new', element: <RecipeGenerate /> },
  { path: '/recipes', element: <Recipes /> },
  { path: '/recipes/:id', element: <RecipeDetail /> },
  { path: '/products/:id', element: <ProductDetail /> },
  { path: '/cart', element: <Cart /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/profile', element: <Profile /> },
  { path: '/merchant/onboard', element: <MerchantOnboard /> },
  { path: '/merchant', element: <MerchantDashboard /> },
  { path: '/merchant/products', element: <MerchantProducts /> },
  { path: '/merchant/orders', element: <MerchantOrders /> },
  { path: '/admin', element: <AdminPanel /> }
];

export default routes;
