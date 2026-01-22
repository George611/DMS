import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';
import Landing from './pages/public/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RoleSelection from './pages/auth/RoleSelection';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import DisasterList from './pages/disasters/DisasterList';
import ReportIncident from './pages/disasters/ReportIncident';
import AlertsPage from './pages/alerts/AlertsPage';
import Resources from './pages/ops/Resources';
import SOS from './pages/ops/SOS';
import EmailVerification from './pages/auth/EmailVerification';
import TwoFactorAuth from './pages/auth/TwoFactorAuth';
import MockOAuth from './pages/auth/MockOAuth';
import UserProfile from './pages/user/UserProfile';
import Audits from './pages/audits/Audits';
import ProtectedRoute from './guards/AuthGuard'; // Using the new guard
import { FaExclamationCircle } from 'react-icons/fa';

// Placeholder Pages (We will build these out next)
const Command = () => <div className="p-4"><h2>Command Center</h2><p>Operational Control & Live Feeds</p></div>;



import { AlertProvider } from './context/AlertContext';
import { AuditProvider } from './context/AuditContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <AuditProvider>
                    <AlertProvider>
                        <ThemeProvider>
                            <Routes>
                                {/* Public/Auth Routes */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/verify-email" element={<EmailVerification />} />
                                <Route path="/2fa" element={<TwoFactorAuth />} />
                                <Route path="/auth/mock/:provider" element={<MockOAuth />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/role-selection" element={<RoleSelection />} />

                                {/* Public Landing */}
                                <Route element={<PublicLayout />}>
                                    <Route path="/" element={<Landing />} />
                                </Route>

                                {/* Protected Authority Routes */}
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/app" element={<MainLayout />}>
                                        <Route path="dashboard" element={<Dashboard />} />
                                        <Route path="disasters" element={<DisasterList />} />
                                        <Route path="report" element={<ReportIncident />} />
                                        <Route path="alerts" element={<AlertsPage />} />
                                        <Route path="command" element={<Command />} />
                                        <Route path="logistics" element={<Resources />} />
                                        <Route path="audits" element={<Audits />} />
                                        <Route path="sos" element={<SOS />} />
                                        <Route path="profile" element={<UserProfile />} />

                                        {/* Fallback */}
                                        <Route path="*" element={<div className="p-4">Page Not Found</div>} />
                                    </Route>
                                </Route>
                            </Routes>
                        </ThemeProvider>
                    </AlertProvider>
                </AuditProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
