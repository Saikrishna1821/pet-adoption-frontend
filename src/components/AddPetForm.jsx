import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../useAuth";

const AddPetForm = () => {
  const {token}=useAuth()
  const [form, setForm] = React.useState({
    name: "",
    age: "",
    gender: "",
    breed: "",
    species: "",
  });

  const [errors, setErrors] = React.useState({});

  const handleInput = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Pet name is required";
    if (!form.age || form.age <= 0)
      newErrors.age = "Age must be greater than 0";
    if (!form.gender) newErrors.gender = "Select gender";
    if (!form.breed.trim()) newErrors.breed = "Breed is required";
    if (!form.species.trim()) newErrors.species = "Species is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/addPet`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        form
      );

      alert("Pet added successfully");

      // optional: reset form
      setForm({
        name: "",
        age: "",
        gender: "",
        species: "",
        breed: "",
      });

      setErrors({});
    } catch (error) {
      console.error(error);
      alert("Failed to add pet");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="petform">
      <div className="field">
        <label>Pet Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleInput}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="field">
        <label>Age</label>
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleInput}
        />
        {errors.age && <span className="error">{errors.age}</span>}
      </div>

      <div className="field">
        <label>Gender</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="M"
              onChange={handleInput}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="F"
              onChange={handleInput}
            />
            Female
          </label>
        </div>
        {errors.gender && <span className="error">{errors.gender}</span>}
      </div>

      <div className="field">
        <label>Breed</label>
        <input
          type="text"
          name="breed"
          value={form.breed}
          onChange={handleInput}
        />
        {errors.breed && <span className="error">{errors.breed}</span>}
      </div>

      <div className="field">
        <label>Species</label>
        <input
          type="text"
          name="species"
          value={form.species}
          onChange={handleInput}
        />
        {errors.species && <span className="error">{errors.species}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default AddPetForm;
