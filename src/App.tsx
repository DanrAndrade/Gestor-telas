import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { ForgotPasswordPage } from './modules/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from './modules/auth/pages/ResetPasswordPage';
import { DashboardLayout } from './modules/dashboard/layouts/DashboardLayout';
import { DashboardHome } from './modules/dashboard/pages/DashboardHome';
import { StockPage } from './modules/dashboard/pages/StockPage';
import { CollectionPage } from './modules/dashboard/pages/CollectionPage';
import { LabPage } from './modules/dashboard/pages/LabPage';
import { HospitalExitPage } from './modules/dashboard/pages/HospitalExitPage';
import { DonorsListPage } from './modules/dashboard/pages/DonorsListPage';
import { DonorFormPage } from './modules/dashboard/pages/DonorFormPage';
import { TriagePage } from './modules/dashboard/pages/TriagePage';
import { LogisticsPage } from './modules/dashboard/pages/LogisticsPage'; // Página Unificada
import { CommunicationPage } from './modules/dashboard/pages/CommunicationPage';
import { AdminUsersPage } from './modules/dashboard/pages/AdminUsersPage';
import { AdminAuditPage } from './modules/dashboard/pages/AdminAuditPage';
import { UserProfilePage } from './modules/dashboard/pages/UserProfilePage';
import { NotFoundPage } from './modules/common/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rotas de Autenticação */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Layout Principal do Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          
          <Route path="perfil" element={<UserProfilePage />} />

          {/* Módulo de Doadores */}
          <Route path="doadores" element={<DonorsListPage />} />
          <Route path="doadores/novo" element={<DonorFormPage />} />
          <Route path="doadores/editar/:id" element={<DonorFormPage />} />
          
          <Route path="triagem" element={<TriagePage />} />
          
          {/* Módulo Técnico */}
          <Route path="coleta" element={<CollectionPage />} />
          <Route path="laboratorio" element={<LabPage />} />
          <Route path="estoque" element={<StockPage />} />
          
          {/* Módulo de Logística (Unificado) */}
          <Route path="logistica" element={<LogisticsPage />} />
          <Route path="saida-hospitalar" element={<HospitalExitPage />} />
          
          {/* Módulo de Gestão */}
          <Route path="comunicacao" element={<CommunicationPage />} />
          <Route path="admin" element={<AdminUsersPage />} />
          <Route path="admin/auditoria" element={<AdminAuditPage />} />
        </Route>

        {/* Rota de Erro 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;