import React, { useState } from "react";
import axios from "axios";
const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccess("");

    if (!validate()) return;

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register`, form);
      setSuccess("Registration successful. Please login.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setApiError("User already exists or invalid data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2>Register</h2>

        {apiError && <p className="error">{apiError}</p>}
        {success && <p className="success">{success}</p>}

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="field-error">{errors.name}</p>}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="field-error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="field-error">{errors.password}</p>}

        <button disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="switch-text">
          Already registered? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};


export default Register;
