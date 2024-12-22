import React, { useState, useEffect } from "react";
import axios from "axios";

interface Person {
  id: number;
  first_name: string;
  last_name: string;
  father_name: string;
  group_id: number | null;
  type: string;
}

interface Group {
  id: number;
  name: string;
}

const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [editingPersonId, setEditingPersonId] = useState<number | null>(null);
  const [editingPerson, setEditingPerson] = useState<Partial<Person>>({});
  const [newPerson, setNewPerson] = useState<Partial<Person>>({
    first_name: "",
    last_name: "",
    father_name: "",
    group_id: null,
    type: "S",
  });

  useEffect(() => {
    fetchPeople();
    fetchGroups();
  }, []);

  const fetchPeople = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.get("http://localhost:8000/people", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPeople(response.data);
    } catch (error) {
      console.error("Failed to fetch people:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.get("http://localhost:8000/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups(response.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  const getGroupName = (groupId: number | null) => {
    const group = groups.find((g) => g.id === groupId);
    return group ? group.name : "No group";
  };

  const getTypeName = (type: string) => {
    return type === "S" ? "Student" : "Teacher";
  };

  const startEditingPerson = (person: Person) => {
    setEditingPersonId(person.id);
    setEditingPerson(person);
  };

  const cancelEditing = () => {
    setEditingPersonId(null);
    setEditingPerson({});
  };

  const saveEditedPerson = async () => {
    if (!editingPersonId || !editingPerson) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      await axios.put(
        `http://localhost:8000/people/${editingPersonId}`,
        editingPerson,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingPersonId(null);
      setEditingPerson({});
      fetchPeople();
    } catch (error) {
      console.error("Failed to update person:", error);
    }
  };

  const deletePerson = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      await axios.delete(`http://localhost:8000/people/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchPeople();
    } catch (error) {
      console.error("Failed to delete person:", error);
    }
  };

  const createPerson = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      await axios.post("http://localhost:8000/people", newPerson, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewPerson({
        first_name: "",
        last_name: "",
        father_name: "",
        group_id: null,
        type: "S",
      });
      fetchPeople();
    } catch (error) {
      console.error("Failed to create person:", error);
    }
  };

  return (
    <div>
      <h1>People</h1>

      <div>
        <h2>Create New Person</h2>
        <input
          type="text"
          placeholder="First Name"
          value={newPerson.first_name || ""}
          onChange={(e) =>
            setNewPerson({ ...newPerson, first_name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newPerson.last_name || ""}
          onChange={(e) =>
            setNewPerson({ ...newPerson, last_name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Father Name"
          value={newPerson.father_name || ""}
          onChange={(e) =>
            setNewPerson({ ...newPerson, father_name: e.target.value })
          }
        />
        <select
          value={newPerson.group_id || ""}
          onChange={(e) =>
            setNewPerson({
              ...newPerson,
              group_id: parseInt(e.target.value, 10) || null,
            })
          }
        >
          <option value="">No group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <select
          value={newPerson.type || ""}
          onChange={(e) =>
            setNewPerson({ ...newPerson, type: e.target.value })
          }
        >
          <option value="S">Student</option>
          <option value="P">Teacher</option>
        </select>
        <button onClick={createPerson}>Create</button>
      </div>

      <ul>
        {people.map((person) => (
          <li key={person.id}>
            {editingPersonId === person.id ? (
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={editingPerson.first_name || ""}
                  onChange={(e) =>
                    setEditingPerson({
                      ...editingPerson,
                      first_name: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={editingPerson.last_name || ""}
                  onChange={(e) =>
                    setEditingPerson({
                      ...editingPerson,
                      last_name: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Father Name"
                  value={editingPerson.father_name || ""}
                  onChange={(e) =>
                    setEditingPerson({
                      ...editingPerson,
                      father_name: e.target.value,
                    })
                  }
                />
                <select
                  value={editingPerson.group_id || ""}
                  onChange={(e) =>
                    setEditingPerson({
                      ...editingPerson,
                      group_id: parseInt(e.target.value, 10) || null,
                    })
                  }
                >
                  <option value="">No group</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <select
                  value={editingPerson.type || ""}
                  onChange={(e) =>
                    setEditingPerson({
                      ...editingPerson,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="S">Student</option>
                  <option value="P">Teacher</option>
                </select>
                <button onClick={saveEditedPerson}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <div>
                {person.first_name} {person.last_name} {person.father_name}, {getTypeName(person.type)}
                {person.type === "S" && `, ${getGroupName(person.group_id)}`}
                <button onClick={() => startEditingPerson(person)}>Edit</button>
                <button onClick={() => deletePerson(person.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeoplePage;
