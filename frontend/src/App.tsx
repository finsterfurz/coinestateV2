import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Web3Provider } from './contexts/Web3Context';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { Dashboard } from './pages/Dashboard';
import { Property } from './pages/Property';
import { About } from './pages/About';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <Router>
          {/* 
            TRANSFORMATION: Professional German Corporate Design
            
            Changed from dark theme (bg-gray-900 text-white) to professional light theme
            for German corporate identity. Dark themes signal "gaming/crypto speculation"
            while light themes with professional colors signal "established business service"
            
            New design aligns with German GmbH beneficial ownership model:
            - Professional light background for trust and compliance
            - CoinEstate brand colors for corporate identity
            - Clean, institutional look suitable for real estate investment
          */}
          <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/property/:id" element={<Property />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
            
            {/* 
              Professional toast notifications aligned with new brand identity
              Light theme with CoinEstate colors for consistency 
            */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  style: {
                    background: '#f0fdf4',
                    color: '#15803d',
                    border: '1px solid #22c55e',
                  },
                },
                error: {
                  style: {
                    background: '#fef2f2',
                    color: '#c53030',
                    border: '1px solid #ef4444',
                  },
                },
              }}
            />
          </div>
        </Router>
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;
