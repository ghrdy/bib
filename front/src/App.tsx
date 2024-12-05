import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import ChildrenPage from "@/pages/ChildrenPage";
import BooksPage from "@/pages/BooksPage";
import SettingsPage from "@/pages/SettingsPage";
import Login from "@/pages/Login";
import CreateAccount from "@/pages/CreateAccount";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route
                path="children"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "referent", "simple"]}
                  >
                    <ChildrenPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="books"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "referent", "simple"]}
                  >
                    <BooksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
