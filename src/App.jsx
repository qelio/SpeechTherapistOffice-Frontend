import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import SignUpPage from './pages/sign-up/SignUpPage';
import AppFooter from "./components/footer/Footer";
import AppHeader from "./components/header/Header";
import SignInPage from "./pages/sign-in/SignInPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
  return (
      <div className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <AppFooter />
      </div>

  );
}
export default App;