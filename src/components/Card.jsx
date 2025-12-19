import axios from "axios";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Button from "./Button";
import { useAuth } from "../useAuth";
import SearchBar from "./SearchBar";
import useDebounce from "../hooks/useDebounce";
import Loader from "./Loader";
import Pagination from "./Pagination";

const PAGE_SIZE = 10;

const Card = () => {
  const { isLoggedIn, user_id, role, token } = useAuth();

  const [pets, setPets] = useState([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPetId, setEditingPetId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", age: "" });
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/allpets`
      );
      const data = res.data?.data ?? [];

      setPets(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const filteredPets = useMemo(() => {
    let data = [...pets];

    if (debouncedSearch) {
      const value = debouncedSearch.toLowerCase();
      data = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(value) ||
          p.breed?.toLowerCase().includes(value)
      );
    }

    if (species) {
      data = data.filter(
        (p) => p.species?.toLowerCase() === species.toLowerCase()
      );
    }

    if (breed) {
      data = data.filter((p) =>
        p.breed?.toLowerCase().includes(breed.toLowerCase())
      );
    }

    if (age) {
      data = data.filter((p) => p.age === Number(age));
    }

    return data;
  }, [pets, debouncedSearch, species, breed, age]);

  /* reset page when filter changes */
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, species, breed, age]);

  /* ---------------- PAGINATION SLICE ---------------- */
  const paginatedPets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredPets.slice(start, end);
  }, [filteredPets, currentPage]);

  /* ---------------- ADOPT ---------------- */
  const handleAdopt = async (payload) => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/adoptpet`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Adoption request submitted");
    fetchData();
  };

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
      editForm,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingPetId(null);
    fetchData();
  };

  const handleDelete = async (pet_id) => {
    if (!window.confirm("Delete this pet?")) return;

    await axios.patch(
      `${process.env.REACT_APP_API_BASE_URL}/removepet/${pet_id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchData();
  };
  if (loading) return <Loader />;

  return (
    <div className="card-layout">
      {/* SEARCH */}
      <SearchBar
        placeholder="Search by name or breed"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTERS */}
      <div className="filters">
        <select value={species} onChange={(e) => setSpecies(e.target.value)}>
          <option value="">All Species</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
        </select>

        <input
          placeholder="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />

        <input
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>

      {/* CARDS */}
      <div className="card-container">
        {paginatedPets.map((pet) => {
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
                        <span onClick={() => handleEditClick(pet)}>Edit</span>
                        <span onClick={() => handleDelete(pet.pet_id)}>
                          Delete
                        </span>
                      </>
                    ) : (
                      <span onClick={() => handleSave(pet.pet_id)}>Save</span>
                    )}
                  </div>
                )}
              </div>

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
<p>
   <strong>Species:</strong> {pet.species}
</p>
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

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={filteredPets.length}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
};

export default Card;
