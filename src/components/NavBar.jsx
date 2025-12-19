import React from "react";
import Button from "./Button";
import { useAuth } from "../useAuth";
import { useLocation } from "react-router-dom";

const AppHeader = ({ username }) => {
  const { user_id, isLoggedIn } = useAuth();
  const location = useLocation();
  const islogInPage = location.pathname == "/login";
  console.log("location", location);
  const LogoutUser = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const RedirectUser = () => {
    if (islogInPage) window.location.href = "/register";
    else window.location.href = "/login";
  };

  return (
    <header className="app-header">
      <div className="app-title">🐾 Pet Adoption Management System</div>

      <div className="welcome-text"></div>
      <div>
        {isLoggedIn ? (
          <Button text="Logout" onClick={LogoutUser} />
        ) : islogInPage ? (
          <Button text="Register" onClick={RedirectUser} />
        ) : (
          <Button text="Login" onClick={RedirectUser} />
        )}
      </div>
    </header>
  );
};

export default AppHeader;
