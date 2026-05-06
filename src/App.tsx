import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Browse from "./pages/Browse";
import ListingDetail from "./pages/ListingDetail";
import NewListing from "./pages/NewListing";
import Dashboard from "./pages/Dashboard";
import MyListings from "./pages/MyListings";
import Offers from "./pages/Offers";
import RFQ from "./pages/RFQ";
import Support from "./pages/Support";
import Profile from "./pages/Profile";

import Rate from "./pages/Rate";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth pages — no layout chrome */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />

              {/* Public pages */}
              <Route path="/" element={<AppLayout><Home /></AppLayout>} />
              <Route path="/browse" element={<AppLayout><Browse /></AppLayout>} />
              <Route path="/listings/:id" element={<AppLayout><ListingDetail /></AppLayout>} />
              <Route path="/rfq" element={<AppLayout><RFQ /></AppLayout>} />

              {/* Protected pages */}
              <Route path="/listings/new" element={<ProtectedRoute><AppLayout><NewListing /></AppLayout></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
              <Route path="/my-listings" element={<ProtectedRoute><AppLayout><MyListings /></AppLayout></ProtectedRoute>} />
              <Route path="/offers" element={<ProtectedRoute><AppLayout><Offers /></AppLayout></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute><AppLayout><Support /></AppLayout></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
              <Route path="/rate" element={<ProtectedRoute><AppLayout><Rate /></AppLayout></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AppLayout><Admin /></AppLayout></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
