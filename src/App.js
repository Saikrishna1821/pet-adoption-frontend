import { Route, Routes } from "react-router-dom";
import "./App.css";
import Card from "./components/Card";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import ViewApplications from "./components/ViewApplications";
import AddPetForm from "./components/AddPetForm";
import Login from "./components/Login";
import Register from "./components/Register";
import { useAuth } from "./useAuth";

function App() {
  const { user_id, role, username } = useAuth();
  return (
    <div className="App">
      <NavBar />

      <div className={`${role !== "VISITOR" ? "layout" : ""}`}>
        <Sidebar role={role} />

        {/* dynamic content */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Card />} />
            <Route path="/home" element={<Card />} />

            <Route path="/manageapplications" element={<ViewApplications />} />
            <Route path="/managepets" element={<AddPetForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
