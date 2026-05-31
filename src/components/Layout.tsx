import { Outlet, useLocation } from 'react-router-dom';
import GlassNavigation from './GlassNavigation';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

const MINIMAL_TEST_PATHS = ['/designer/test', '/designer/test-results'];

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isMinimalTest = MINIMAL_TEST_PATHS.includes(location.pathname);

  if (isMinimalTest) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-nav border-b border-outline-variant/15">
          <div className="flex items-center h-full px-6 max-w-[1440px] mx-auto">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <span className="text-on-surface font-bold text-sm">D</span>
            </div>
            <span className="text-on-surface font-semibold text-lg ml-3">DesignConnect</span>
          </div>
        </nav>
        <main className="pt-16 min-h-screen">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlassNavigation />
      {isAuthenticated && <Sidebar />}
      <main className={`pt-16 min-h-screen ${isAuthenticated ? 'lg:ml-[260px]' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}
