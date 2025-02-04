import { Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage"; // Import your edit profile component
import PageLayout from "./Layouts/PageLayout/PageLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CreateTripPage from "./pages/CreateTripPage";
import TripPage from "./pages/TripPage";


function AuthenticatedApp() {
  const { currentUser } = useAuth();

  const ProfileRedirect = () => {
    return <Navigate to={`/profile/${currentUser?._id}`} replace />;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={currentUser ? <ProfileRedirect /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={currentUser ? <ProfileRedirect /> : <SignupPage />} 
      />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          currentUser ? (
            <PageLayout>
              <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                {/* New edit profile route */}
                <Route path="/edit-profile" element={<EditProfilePage />} />
                  <Route path="/createTrip" element={<CreateTripPage />} />
                  <Route path = "/trip/:id" element = {<TripPage />} />
                {/* Redirect all other paths to profile */}
                <Route path="*" element={<ProfileRedirect />} />
              </Routes>
            </PageLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;