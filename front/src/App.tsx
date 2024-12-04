import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import AdminDashboard from '@/pages/AdminDashboard';
import WorkerDashboard from '@/pages/WorkerDashboard';
import Login from '@/pages/Login';
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="admin/*" element={<AdminDashboard />} />
            <Route path="worker/*" element={<WorkerDashboard />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;