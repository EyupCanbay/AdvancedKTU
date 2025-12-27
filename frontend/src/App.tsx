import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Yeni eklenen
import CentersPage from './pages/CentersPage';
import { MilestonePage } from './pages/MilestonePage';
import { SelectCenterPage } from './pages/SelectCenterPage';
import ImpactDashboard from './pages/ImpactDashboard';
import { AboutPage } from './pages/AboutPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> {/* Yeni rota */}
      <Route path="/milestone" element={<MilestonePage />} /> {/* Bu satırı ekle */}
      <Route path="/select-center" element={<SelectCenterPage />} />
      <Route path="/centers" element={<CentersPage />} />
      <Route path="/impact" element={<ImpactDashboard />} /> {/* Gerçek Zamanlı Etki Analizi */}
      <Route path="/about" element={<AboutPage />} />
<Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
export default App;