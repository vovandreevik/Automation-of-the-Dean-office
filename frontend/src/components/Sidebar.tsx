import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

interface LoginBtnProps {
  onLogout: () => void; // Функция для обработки выхода из аккаунта
}

const Sidebar: React.FC<LoginBtnProps> = ({ onLogout }) => {
  const username = localStorage.getItem("login") || "Unknown User";
  const person = JSON.parse(localStorage.getItem("person") || "null");

  return (
    <div className="toolbar">
      <h2>
        Welcome,{" "}
        {person
          ? `${person.first_name} ${person.last_name} ${person.father_name}`
          : username}
      </h2>
      <button onClick={onLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
      <nav className="sidebar">
        <NavLink
          to="/analytics"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          Аналитика
        </NavLink>
        <NavLink
          to="/groups"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          Группы
        </NavLink>
        <NavLink
          to="/people"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          Люди
        </NavLink>
        <NavLink
          to="/subjects"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          Предметы
        </NavLink>
        <NavLink
          to="/marks"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          Оценки
        </NavLink>
      </nav>
    </div>
  );
};


export default Sidebar;
