import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Subject {
  id: number;
  name: string;
}

const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.get("http://localhost:8000/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(response.data);
    } catch (error) {
      toast.error("Failed to fetch subjects.");
    }
  };

  const addSubject = async () => {
    if (!newSubjectName.trim()) {
      toast.warning("Subject name cannot be empty.");
      return;
    }

    // Проверка на уникальность
    if (subjects.some((subject) => subject.name === newSubjectName.trim())) {
      toast.error("Subject name must be unique.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.post(
        "http://localhost:8000/subjects",
        { name: newSubjectName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSubjects([...subjects, response.data]);
      setNewSubjectName("");
      toast.success("Subject added successfully.");
    } catch (error) {
      toast.error("Failed to add subject.");
    }
  };

  const updateSubject = async (subject: Subject) => {
    if (!subject.name.trim()) {
      toast.warning("Subject name cannot be empty.");
      return;
    }

    // Проверка на уникальность
    if (
      subjects.some(
        (s) => s.id !== subject.id && s.name === subject.name.trim()
      )
    ) {
      toast.error("Subject name must be unique.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      await axios.put(
        `http://localhost:8000/subjects/${subject.id}`,
        { name: subject.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSubjects(subjects.map((s) => (s.id === subject.id ? subject : s)));
      setEditingSubject(null);
      toast.success("Subject updated successfully.");
    } catch (error) {
      toast.error("Failed to update subject.");
    }
  };

  const deleteSubject = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      await axios.delete(`http://localhost:8000/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubjects(subjects.filter((subject) => subject.id !== id));
      toast.success("Subject deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete subject.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Subjects</h1>

      <div>
        <input
          type="text"
          placeholder="New subject name"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
        />
        <button onClick={addSubject}>Add</button>
      </div>

      <ul>
        {subjects.map((subject) => (
          <li key={subject.id}>
            {editingSubject?.id === subject.id ? (
              <input
                type="text"
                value={editingSubject.name}
                onChange={(e) =>
                  setEditingSubject({ ...editingSubject, name: e.target.value })
                }
              />
            ) : (
              <span>{subject.name}</span>
            )}
            {editingSubject?.id === subject.id ? (
              <button onClick={() => updateSubject(editingSubject)}>
                Save
              </button>
            ) : (
              <button onClick={() => setEditingSubject(subject)}>Edit</button>
            )}
            <button onClick={() => deleteSubject(subject.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubjectsPage;
