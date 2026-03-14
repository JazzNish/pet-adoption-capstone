import { Routes, Route } from "react-router-dom";

/* Layouts */
import PublicLayout from "./layout/PublicLayout";
import MemberLayout from "./layout/MemberLayout";
import AdminLayout from "./layout/AdminLayout";

/* Guards */
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminUsers from "./pages/AdminUser";
import AdminPets from "./pages/AdminPets";
import AdminVerifications from "./pages/AdminVerification";
import AdminReports from "./pages/AdminReport";
import AdminSettings from "./pages/AdminSettings";

/* Public Pages */
import LandingPage from "./pages/Landing";
import OurMission from "./pages/Mission";
import PetDetails from "./pages/PetDetails";

/* Auth Pages */
import LogIn from "./pages/LogIn";
import CreateAccount from "./pages/CreateAccount";
import ForgotPassword from "./pages/ForgotPassword";

/* Member Pages */
import BrowsePets from "./pages/adopter/BrowsePets";
import MyApplications from "./pages/adopter/MyApplications";
import Messages from "./pages/Message";
import MyPets from "./pages/rehomer/MyPets";
import AdoptionRequest from "./pages/rehomer/AdoptionRequest";
import ProfileSettings from "./pages/ProfileSettings";
import PublicProfile from "./pages/PublicProfile";
import MyProfile from "./pages/MyProfile";
import PetChat from "./pages/PetChat";
import ApplicationForm from "./pages/ApplicationForm";
import SavedPets from "./pages/SavedPets";

function App() {
  const user = JSON.parse(localStorage.getItem('furever_user'));
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user; // 👈 Quick check to see if they are logged in!

  return (
    <Routes>
       
      {/* GUEST ONLY PAGES (Logged-in users get safely redirected away by GuestRoute) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />
        <Route path="/mission" element={<GuestRoute><OurMission /></GuestRoute>} />
      </Route>

      {/* Auth Pages (Also Guest Only) */}
      <Route path="/create-account" element={<GuestRoute><CreateAccount /></GuestRoute>} />
      <Route path="/log-in" element={<GuestRoute><LogIn /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />


      {/* UNIVERSAL PAGES (Accessible to BOTH guests and logged-in members) */}
      {/* MAGIC: If logged in, show MemberLayout (with profile pic). If not, show PublicLayout! */}
      <Route element={isAuthenticated ? <MemberLayout /> : <PublicLayout />}>
        <Route path="/browse-pets" element={<BrowsePets />} />
        <Route path="/pet-details/:id" element={<PetDetails />} />
      </Route>


      {/* MEMBER ONLY PAGES (Must be logged in to access) */}
      <Route element={<ProtectedRoute><MemberLayout /></ProtectedRoute>}>
        <Route path="/messages" element={<Messages />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/chat/:petId/:otherUserId" element={<PetChat />} />
        <Route path="/my-pets" element={<MyPets />} />
        <Route path="/adoption-requests" element={<AdoptionRequest />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/user/:id" element={<PublicProfile />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/apply/:petId" element={<ApplicationForm />} />
        <Route path="/saved-pets" element={<SavedPets />} />
      </Route>

      {/* DMIN ROUTES (Protected securely inside AdminLayout) */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/pets" element={<AdminPets />} />
        <Route path="/admin/verifications" element={<AdminVerifications />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route path="/admin-login" element={<AdminLogin />} />

    </Routes>
  );
}

export default App;