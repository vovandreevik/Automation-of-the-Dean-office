import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

interface Group {
  id: number;
  name: string;
}

const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.get("http://localhost:8000/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups(response.data);
    } catch (error) {
      toast.error("Failed to fetch groups.");
    }
  };

  const addGroup = async () => {
    if (!newGroupName.trim()) {
      toast.warning("Group name cannot be empty.");
      return;
    }

    // Проверка на уникальность
    if (groups.some((group) => group.name === newGroupName.trim())) {
      toast.error("Group name must be unique.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      await axios.post(
        "http://localhost:8000/groups",
        { name: newGroupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewGroupName("");
      fetchGroups();
      toast.success("Group added successfully.");
    } catch (error) {
      toast.error("Failed to add group.");
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      await axios.delete(`http://localhost:8000/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchGroups();
      toast.success("Group deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete group.");
    }
  };

  const startEditingGroup = (id: number, name: string) => {
    setEditingGroupId(id);
    setEditingGroupName(name);
  };

  const cancelEditing = () => {
    setEditingGroupId(null);
    setEditingGroupName("");
  };

  const saveEditedGroup = async () => {
    if (!editingGroupId) return;

    if (!editingGroupName.trim()) {
      toast.warning("Group name cannot be empty.");
      return;
    }

    // Проверка на уникальность
    if (
      groups.some(
        (group) =>
          group.id !== editingGroupId && group.name === editingGroupName.trim()
      )
    ) {
      toast.error("Group name must be unique.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      await axios.put(
        `http://localhost:8000/groups/${editingGroupId}`,
        { name: editingGroupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingGroupId(null);
      setEditingGroupName("");
      fetchGroups();
      toast.success("Group updated successfully.");
    } catch (error) {
      toast.error("Failed to update group.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Groups</h1>
      <div>
        <input
          type="text"
          placeholder="New group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button onClick={addGroup}>Add Group</button>
      </div>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            {editingGroupId === group.id ? (
              <div>
                <input
                  type="text"
                  value={editingGroupName}
                  onChange={(e) => setEditingGroupName(e.target.value)}
                />
                <button onClick={saveEditedGroup}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <div>
                <span>{group.name}</span>
                <button onClick={() => startEditingGroup(group.id, group.name)}>
                  Edit
                </button>
                <button onClick={() => deleteGroup(group.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsPage;
