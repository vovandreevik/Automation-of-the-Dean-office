import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Mark {
  id: number;
  student_id: number;
  subject_id: number;
  teacher_id: number;
  value: number;
}

interface Person {
  id: number;
  first_name: string;
  last_name: string;
  father_name: string;
  type: string; // "S" for students, "T" for teachers
}

interface Subject {
  id: number;
  name: string;
}

const MarksPage: React.FC = () => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [students, setStudents] = useState<Person[]>([]);
  const [teachers, setTeachers] = useState<Person[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newMark, setNewMark] = useState({
    studentId: "",
    teacherId: "",
    subjectId: "",
    grade: "",
  });
  const [editingMark, setEditingMark] = useState<Mark | null>(null);

  useEffect(() => {
    fetchMarks();
    fetchPeople();
    fetchSubjects();
  }, []);

  const fetchMarks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.get("http://localhost:8000/marks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMarks(response.data);
    } catch (error) {
      console.error("Failed to fetch marks:", error);
    }
  };

  const fetchPeople = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.get("http://localhost:8000/people", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const people = response.data as Person[];
      setStudents(people.filter((person) => person.type === "S"));
      setTeachers(people.filter((person) => person.type === "P"));
    } catch (error) {
      console.error("Failed to fetch people:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.get("http://localhost:8000/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubjects(response.data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  };

  const addMark = async () => {
    if (
      !newMark.studentId ||
      !newMark.teacherId ||
      !newMark.subjectId ||
      !newMark.grade
    ) {
      console.error("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const payload = {
        student_id: Number(newMark.studentId),
        subject_id: Number(newMark.subjectId),
        teacher_id: Number(newMark.teacherId),
        value: Number(newMark.grade),
      };

      await axios.post("http://localhost:8000/marks", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewMark({ studentId: "", teacherId: "", subjectId: "", grade: "" });
      fetchMarks();
    } catch (error: any) {
            toast.error("Failed to add mark");
      
      console.error(
        "Failed to add mark:",
        error.response?.data || error.message
      );
    }
  };

  const deleteMark = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      await axios.delete(`http://localhost:8000/marks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchMarks();
    } catch (error) {
      console.error("Failed to delete mark:", error);
    }
  };

  const updateMark = async () => {
    if (!editingMark) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const payload = {
        student_id: editingMark.student_id,
        subject_id: editingMark.subject_id,
        teacher_id: editingMark.teacher_id,
        value: editingMark.value,
      };

      await axios.put(
        `http://localhost:8000/marks/${editingMark.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditingMark(null);
      fetchMarks();
    } catch (error) {
      console.error("Failed to update mark:", error);
    }
  };

  const formatName = (person: Person) => {
    return `${person.last_name} ${person.first_name} ${person.father_name}`;
  };

  const getStudentName = (id: number) => {
    const student = students.find((s) => s.id === id);
    return student ? formatName(student) : "Unknown";
  };

  const getTeacherName = (id: number) => {
    const teacher = teachers.find((t) => t.id === id);
    return teacher ? formatName(teacher) : "Unknown";
  };

  const getSubjectName = (id: number) => {
    const subject = subjects.find((s) => s.id === id);
    return subject ? subject.name : "Unknown";
  };

  return (
    <div>
      <ToastContainer />
      <h1>Marks</h1>
      <div>
        <select
          value={newMark.studentId}
          onChange={(e) =>
            setNewMark({ ...newMark, studentId: e.target.value })
          }
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {formatName(student)}
            </option>
          ))}
        </select>
        <select
          value={newMark.teacherId}
          onChange={(e) =>
            setNewMark({ ...newMark, teacherId: e.target.value })
          }
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {formatName(teacher)}
            </option>
          ))}
        </select>
        <select
          value={newMark.subjectId}
          onChange={(e) =>
            setNewMark({ ...newMark, subjectId: e.target.value })
          }
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Grade"
          value={newMark.grade}
          onChange={(e) => setNewMark({ ...newMark, grade: e.target.value })}
        />
        <button onClick={addMark}>Add Mark</button>
      </div>
      <ul>
        {marks.map((mark) => (
          <li key={mark.id}>
            Student: {getStudentName(mark.student_id)}, Subject:{" "}
            {getSubjectName(mark.subject_id)}, Teacher:{" "}
            {getTeacherName(mark.teacher_id)}, Grade: {mark.value}
            <button onClick={() => deleteMark(mark.id)}>Delete</button>
            <button onClick={() => setEditingMark(mark)}>Edit</button>
          </li>
        ))}
      </ul>
      {editingMark && (
        <div>
          <h2>Edit Mark</h2>
          <select
            value={editingMark.student_id}
            onChange={(e) =>
              setEditingMark({
                ...editingMark,
                student_id: Number(e.target.value),
              })
            }
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {formatName(student)}
              </option>
            ))}
          </select>
          <select
            value={editingMark.subject_id}
            onChange={(e) =>
              setEditingMark({
                ...editingMark,
                subject_id: Number(e.target.value),
              })
            }
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <select
            value={editingMark.teacher_id}
            onChange={(e) =>
              setEditingMark({
                ...editingMark,
                teacher_id: Number(e.target.value),
              })
            }
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {formatName(teacher)}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={editingMark.value}
            onChange={(e) =>
              setEditingMark({ ...editingMark, value: Number(e.target.value) })
            }
          />
          <button onClick={updateMark}>Save</button>
          <button onClick={() => setEditingMark(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MarksPage;
