import { Routes, Route, Link, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "@/lib/auth";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Browse from "@/pages/Browse";
import ProtectedRoute from "@/components/ProtectedRoute";

function Home() {
  const { session } = useAuth();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-10">
      <h1 className="text-4xl font-bold text-blue-800">MIZAN</h1>

      <div className="mt-6 flex gap-4">
        <Link
          to="/marketplace"
          className="px-6 py-3 rounded-lg bg-blue-700 text-white"
        >
          Marketplace
        </Link>

        {session ? (
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-lg border"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/auth"
            className="px-6 py-3 rounded-lg border"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/marketplace" element={<Browse />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster />
    </>
  );
}
