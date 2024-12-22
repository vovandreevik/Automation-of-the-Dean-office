import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";
import GroupsPage from "./pages/GroupsPage";
import PeoplePage from "./pages/PeoplePage";
import SubjectsPage from "./pages/SubjectsPage";
import MarksPage from "./pages/MarksPage";
import AnalyticsPage from "./pages/AnalyticsPage";

const App: React.FC = () => {
  // Обработчик выхода из аккаунта
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/"; // Перенаправление на страницу входа
  };

  return (
    <Router>
      <Routes>
        {/* Страница входа */}
        <Route path="/" element={<LoginPage />} />

        {/* Аналитика */}
        <Route
          path="/analytics"
          element={
            <div style={{ display: "flex" }}>
              <Sidebar onLogout={handleLogout} />
              <div style={{ marginLeft: "200px", padding: "1rem", width: "100%" }}>
                <AnalyticsPage />
              </div>
            </div>
          }
        />

        {/* Группы */}
        <Route
          path="/groups"
          element={
            <div style={{ display: "flex" }}>
              <Sidebar onLogout={handleLogout} />
              <div style={{ marginLeft: "200px", padding: "1rem", width: "100%" }}>
                <GroupsPage />
              </div>
            </div>
          }
        />

        {/* Люди */}
        <Route
          path="/people"
          element={
            <div style={{ display: "flex" }}>
              <Sidebar onLogout={handleLogout} />
              <div style={{ marginLeft: "200px", padding: "1rem", width: "100%" }}>
                <PeoplePage />
              </div>
            </div>
          }
        />

        {/* Предметы */}
        <Route
          path="/subjects"
          element={
            <div style={{ display: "flex" }}>
              <Sidebar onLogout={handleLogout} />
              <div style={{ marginLeft: "200px", padding: "1rem", width: "100%" }}>
                <SubjectsPage />
              </div>
            </div>
          }
        />

        {/* Оценки */}
        <Route
          path="/marks"
          element={
            <div style={{ display: "flex" }}>
              <Sidebar onLogout={handleLogout} />
              <div style={{ marginLeft: "200px", padding: "1rem", width: "100%" }}>
                <MarksPage />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
