import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import { LoginPage } from './modules/auth/pages/LoginPage';
import { ForgotPasswordPage } from './modules/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from './modules/auth/pages/ResetPasswordPage';

// Layout & Dashboard
import { DashboardLayout } from './modules/dashboard/layouts/DashboardLayout';
import { DashboardHome } from './modules/dashboard/pages/DashboardHome';
import { UserProfilePage } from './modules/dashboard/pages/UserProfilePage';

// Modules
import { DonorsListPage } from './modules/dashboard/pages/DonorsListPage';
import { DonorFormPage } from './modules/dashboard/pages/DonorFormPage';
import { TriagePage } from './modules/dashboard/pages/TriagePage';
import { CollectionPage } from './modules/dashboard/pages/CollectionPage';
import { LabPage } from './modules/dashboard/pages/LabPage';
import { StockPage } from './modules/dashboard/pages/StockPage';
import { LogisticsPage } from './modules/dashboard/pages/LogisticsPage';
import { HospitalExitPage } from './modules/dashboard/pages/HospitalExitPage';
import { CommunicationPage } from './modules/dashboard/pages/CommunicationPage';

// Admin Pages
import { AdminUsersPage } from './modules/dashboard/pages/AdminUsersPage';
import { AdminAuditPage } from './modules/dashboard/pages/AdminAuditPage';
import { StockConfigurationPage } from './modules/dashboard/pages/StockConfigurationPage'; // Nova Página

import { NotFoundPage } from './modules/common/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          
          <Route index element={<DashboardHome />} />
          <Route path="perfil" element={<UserProfilePage />} />

          <Route path="doadores" element={<DonorsListPage />} />
          <Route path="doadores/novo" element={<DonorFormPage />} />
          <Route path="doadores/editar/:id" element={<DonorFormPage />} />
          <Route path="triagem" element={<TriagePage />} />
          
          <Route path="coleta" element={<CollectionPage />} />
          <Route path="laboratorio" element={<LabPage />} />
          <Route path="estoque" element={<StockPage />} />
          
          <Route path="logistica" element={<LogisticsPage />} />
          <Route path="saida-hospitalar" element={<HospitalExitPage />} />
          
          <Route path="comunicacao" element={<CommunicationPage />} />
          <Route path="admin" element={<AdminUsersPage />} />
          <Route path="admin/configuracao" element={<StockConfigurationPage />} /> {/* Rota Nova */}
          <Route path="admin/auditoria" element={<AdminAuditPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;