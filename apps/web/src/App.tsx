import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Skeleton from './components/Skeleton';
import useAppStore from './lib/store';
import { ToastViewport } from './components/Toast';

function App() {
  const element = useRoutes(routes);
  const { bootstrap } = useAppStore();

  if (!bootstrap.initialized) {
    bootstrap.init();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
        <Skeleton className="h-12 w-40" />
        <p className="mt-4 text-slate-500">正在加载 LightEats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="pb-20">
        <Suspense fallback={<Skeleton className="h-32" />}>
          {element}
        </Suspense>
      </main>
      <Footer />
      <ToastViewport />
    </div>
  );
}

export default App;
