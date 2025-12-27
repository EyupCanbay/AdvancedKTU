import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Yeni eklenen
import CentersPage from './pages/CentersPage';
import { MilestonePage } from './pages/MilestonePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> {/* Yeni rota */}
      <Route path="/milestone" element={<MilestonePage />} /> {/* Bu satırı ekle */}
      <Route path="/centers" element={<CentersPage />} />
    </Routes>
  );
}
export default App;