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
import { DistributionPage } from './modules/dashboard/pages/DistributionPage';
import { CommunicationPage } from './modules/dashboard/pages/CommunicationPage';
import { AdminUsersPage } from './modules/dashboard/pages/AdminUsersPage';
import { AdminAuditPage } from './modules/dashboard/pages/AdminAuditPage'; // Novo
import { UserProfilePage } from './modules/dashboard/pages/UserProfilePage';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300 m-4">
    <h2 className="text-xl font-bold mb-2">Módulo em Desenvolvimento</h2>
    <p>A tela de {title} será implementada em breve.</p>
  </div>
);

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
          
          <Route path="logistica" element={<DistributionPage />} />
          <Route path="saida-hospitalar" element={<HospitalExitPage />} />
          
          <Route path="comunicacao" element={<CommunicationPage />} />
          <Route path="admin" element={<AdminUsersPage />} />
          <Route path="admin/auditoria" element={<AdminAuditPage />} /> {/* Nova Rota */}
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;