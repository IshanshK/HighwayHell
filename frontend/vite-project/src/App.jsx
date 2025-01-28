
import { Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";

function App() {
  const location = useLocation();

  return (
    <PageLayout>
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      </PageLayout>
  );
}

export default App;