import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import Layout from '@/components/layout/Layout';

// Public pages
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import VerifyEmail from '@/pages/auth/VerifyEmail';
import VerificationSuccess from '@/pages/auth/VerificationSuccess';
import VerificationFailed from '@/pages/auth/VerificationFailed';
import ChooseRole from '@/pages/auth/ChooseRole';

// Onboarding
import DesignerTest from '@/pages/auth/DesignerTest';
import TestResults from '@/pages/auth/TestResults';
import RestrictedAccess from '@/pages/auth/RestrictedAccess';

// Designer pages
import DesignerDashboard from '@/pages/designer/Dashboard';
import Portfolio from '@/pages/designer/Portfolio';
import AddPortfolioItem from '@/pages/designer/AddPortfolioItem';
import EditPortfolioItem from '@/pages/designer/EditPortfolioItem';
import CreatePost from '@/pages/designer/CreatePost';
import DesignerRequests from '@/pages/designer/Requests';
import Earnings from '@/pages/designer/Earnings';

// Client pages
import ClientDashboard from '@/pages/client/Dashboard';
import BrowseDesigners from '@/pages/client/BrowseDesigners';
import DesignerProfile from '@/pages/client/DesignerProfile';
import SendRequest from '@/pages/client/SendRequest';
import ClientRequests from '@/pages/client/MyRequests';

// Shared pages
import Chat from '@/pages/shared/Chat';
import Notifications from '@/pages/shared/Notifications';
import Settings from '@/pages/shared/Settings';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminDisputes from '@/pages/admin/Disputes';
import AdminUsers from '@/pages/admin/Users';

// Utility pages
import About from '@/pages/utility/About';
import Terms from '@/pages/utility/Terms';
import Privacy from '@/pages/utility/Privacy';
import Contact from '@/pages/utility/Contact';
import Error404 from '@/pages/utility/Error404';
import Error500 from '@/pages/utility/Error500';
import Maintenance from '@/pages/utility/Maintenance';
import ClientCreatePost from '@/pages/client/CreatePost';
import { GuestOnly } from '@/components/auth/AuthGuard';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public routes - no layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verification-success" element={<VerificationSuccess />} />
            <Route path="/verification-failed" element={<VerificationFailed />} />

            {/* Routes with layout */}
            <Route element={<Layout />}>
              {/* Public */}
              <Route path="/" element={<GuestOnly><Landing /></GuestOnly>} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/choose-role" element={<ChooseRole />} />

              {/* Onboarding */}
              <Route path="/designer/test" element={<DesignerTest />} />
              <Route path="/designer/test-results" element={<TestResults />} />
              <Route path="/designer/restricted" element={<RestrictedAccess />} />

              {/* Designer routes */}
              <Route path="/designer/dashboard" element={<DesignerDashboard />} />
              <Route path="/designer/portfolio" element={<Portfolio />} />
              <Route path="/designer/portfolio/add" element={<AddPortfolioItem />} />
              <Route path="/designer/portfolio/edit/:id" element={<EditPortfolioItem />} />
              <Route path="/designer/posts/create" element={<CreatePost />} />
              <Route path="/designer/requests" element={<DesignerRequests />} />
              <Route path="/designer/earnings" element={<Earnings />} />

              {/* Client routes */}
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/client/browse" element={<BrowseDesigners />} />
              <Route path="/client/designer/:id" element={<DesignerProfile />} />
              <Route path="/client/request/:id" element={<SendRequest />} />
              <Route path="/client/requests" element={<ClientRequests />} />
              <Route path="/client/posts/create" element={<ClientCreatePost />} />

              {/* Shared routes */}
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />

              {/* Admin routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/disputes" element={<AdminDisputes />} />
              <Route path="/admin/users" element={<AdminUsers />} />

              {/* Error pages */}
              <Route path="/404" element={<Error404 />} />
              <Route path="/500" element={<Error500 />} />
              <Route path="/maintenance" element={<Maintenance />} />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
