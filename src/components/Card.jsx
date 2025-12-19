import axios from "axios";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Button from "./Button";
import { useAuth } from "../useAuth";
import SearchBar from "./SearchBar";
import useDebounce from "../hooks/useDebounce";

const Card = () => {
  const { isLoggedIn, user_id, role, token } = useAuth();

  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [editingPetId, setEditingPetId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", age: "" });

  const debouncedSearch = useDebounce(search, 200);
  const originalData = useRef([]);

  /* ---------------- FETCH ---------------- */
  const fetchData = useCallback(async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/allpets`
    );
    const data = res.data?.data ?? [];
    originalData.current = data;
    setPets(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------------- SEARCH ---------------- */
  useEffect(() => {
    if (!originalData.current.length) return;

    const value = debouncedSearch.toLowerCase().trim();
    if (!value) {
      setPets(originalData.current);
      return;
    }

    const filtered = originalData.current.filter(
      (p) =>
        (p.name ?? "").toLowerCase().includes(value) ||
        (p.breed ?? "").toLowerCase().includes(value)
    );

    setPets(filtered);
  }, [debouncedSearch]);

  /* ---------------- ADOPT ---------------- */
  const handleAdopt = async (payload) => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/adoptpet`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      payload
    );
    alert("Adoption request has been submitted");
    fetchData();
  };

  /* ---------------- EDIT ---------------- */
  const handleEditClick = (pet) => {
    setEditingPetId(pet.pet_id);
    setEditForm({ name: pet.name, age: pet.age });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (pet_id) => {
    await axios.patch(
      `${process.env.REACT_APP_API_BASE_URL}/updatepet/${pet_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      editForm
    );
    setEditingPetId(null);
    fetchData();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (pet_id) => {
    const confirm = window.confirm("Are you sure you want to delete this pet?");
    if (!confirm) return;

    await axios.patch(
      `${process.env.REACT_APP_API_BASE_URL}/removepet/${pet_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchData();
  };

  return (
    <div className="card-layout">
      <div className="search-layout">
        <SearchBar
          placeholder="Search By Name or Breed"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />{" "}
      </div>

      <div className="card-container">
        {pets.map((pet) => {
          const isEditing = editingPetId === pet.pet_id;

          return (
            <div key={pet.pet_id} className="pet-card">
              <div className="pet-header">
                {isEditing ? (
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                  />
                ) : (
                  <h3>{pet.name}</h3>
                )}

                {role === "ADMIN" && (
                  <div className="admin-actions">
                    {!isEditing ? (
                      <>
                        <strong onClick={() => handleEditClick(pet)}>
                          Edit
                        </strong>
                        <strong onClick={() => handleDelete(pet.pet_id)}>
                          Delete
                        </strong>
                      </>
                    ) : (
                      <strong onClick={() => handleSave(pet.pet_id)}>
                        Save
                      </strong>
                    )}
                  </div>
                )}
              </div>

              <div className="pet-info">
                <p>
                  <strong>Age:</strong>{" "}
                  {isEditing ? (
                    <input
                      name="age"
                      type="number"
                      value={editForm.age}
                      onChange={handleEditChange}
                    />
                  ) : (
                    pet.age
                  )}
                </p>

                <p>
                  <strong>Breed:</strong> {pet.breed}
                </p>
              </div>

              {!isEditing && (
                <Button
                  text="Adopt"
                  onClick={() => handleAdopt({ pet_id: pet.pet_id, user_id })}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
