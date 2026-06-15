import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Category } from './pages/Category/Category';
import { SearchPage } from './pages/Search/Search';
import { Watch } from './pages/Watch/Watch';
import { Upload } from './pages/Upload/Upload';
import { Admin } from './pages/Admin/Admin';
import { Feedback } from './pages/Feedback/Feedback';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/genre/:slug" element={<Category />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
