import { Outlet, useLocation } from 'react-router-dom';
import StickyNavbar from './components/StickyNavbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {!isHome && <StickyNavbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isHome && <Footer />}
      <ToastContainer />
    </div>
  );
}
