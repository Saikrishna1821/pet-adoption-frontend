import React from "react";
import { NavLink } from "react-router-dom";

const SidebarConfig = {
  'USER': [
    { label: "Home", path: "/home" },
    { label: "View Adoptions", path: "/manageapplications" },
  ],
  'ADMIN': [
    { label: "Home", path: "/home" },
    { label: "Manage Applications", path: "/manageapplications" },
    { label: "Manage Pets", path: "/managepets" },
  ],
};

const Sidebar = ({ role }) => {
  const menuItems = SidebarConfig[role] || [];
 if(menuItems.length==0)
    return null
  return (
    <aside className="sidebar">
      <header className="sidebar-header">🐾Menu</header>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
