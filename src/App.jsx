import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import SignUpPage from './pages/sign-up/SignUpPage';
import AppFooter from "./components/footer/Footer";
import AppHeader from "./components/header/Header";
import SignInPage from "./pages/sign-in/SignInPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilePage from "./pages/profile/ProfilePage";
import styles from "./App.css"
import SubscriptionsPage from "./pages/subscriptions-page/SubscriptionsPage";
import SchedulePage from "./pages/schedule/SchedulePage";
import TeachingPage from "./pages/teaching/TeachingPage";
import EducationMaterialsPage from "./pages/education-materials/EducationMaterialsPage";
import ScheduleTeacherPage from "./pages/schedule-teacher/ScheduleTeacherPage";

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
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/schedule-teacher" element={<ScheduleTeacherPage />} />
            <Route path="/teaching" element={<TeachingPage />} />
            <Route path="/education-materials" element={<EducationMaterialsPage />} />
          </Routes>
        </main>
        <AppFooter />
      </div>

  );
}
export default App;