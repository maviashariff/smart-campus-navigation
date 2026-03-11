import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {/* Footer shows on admin page — home page is full-height so it won't show there */}
      {location.pathname === '/admin' && <Footer />}
    </div>
  );
}

export default App;
