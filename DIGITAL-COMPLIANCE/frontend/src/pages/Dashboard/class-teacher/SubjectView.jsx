import { useState, useEffect } from "react";
import axios from "../../../services/api";

const SubjectView = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState({}); // Track edit mode per subject
  const [selectedTeachers, setSelectedTeachers] = useState({}); // Store selected teachers

  // Fetch subjects and teachers from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjectRes, teacherRes] = await Promise.all([
        axios.get("class-teacher/subjects"),
        axios.get("class-teacher/teachers"),
      ]);

      const subjects = subjectRes.data.subjects;
      const teachers = teacherRes.data.teachers;

      // Assign teachers to subjects
      const updatedSubjects = subjects.map((subject) => {
        // Find the theory teacher
        const theoryTeacher = teachers.find((teacher) =>
          teacher.subject.some(
            (s) => s.name === subject.name && s.role === "theoryTeacher"
          )
        );

        // Find the assignment teacher
        const assignmentTeacher = teachers.find((teacher) =>
          teacher.subject.some(
            (s) => s.name === subject.name && s.role === "assignmentTeacher"
          )
        );

        return {
          ...subject,
          theoryTeacher: theoryTeacher ? theoryTeacher.name : "", // Assign name or empty string
          assignmentTeacher: assignmentTeacher ? assignmentTeacher.name : "", // Assign name or empty string
        };
      });

      // Update subjects state with assigned teachers
      setSubjects(updatedSubjects);
      setTeachers(teachers);

      console.log("Updated Subjects with Teachers:", subjects);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle teacher selection (update state only)
  const handleTeacherChange = (subjectName, teacherId, role) => {
    setSelectedTeachers((prev) => ({
      ...prev,
      [subjectName]: { ...prev[subjectName], [role]: teacherId },
    }));
  };

  // Handle update click
  // Handle update click
  const handleUpdate = async (subjectName) => {
    try {
      const subject = selectedTeachers[subjectName];

      if (!subject || (!subject.theoryTeacher && !subject.assignmentTeacher)) {
        console.error("No teacher selected for update");
        return;
      }

      // Find the previous teachers for the subject (from `subjects` state)
      const currentSubject = subjects.find((s) => s.name === subjectName);
      const previousTheoryTeacher = currentSubject?.theoryTeacher || "";
      const previousAssignmentTeacher = currentSubject?.assignmentTeacher || "";

      // Send requests for each teacher role
      const requests = [];

      if (subject.theoryTeacher) {
        requests.push(
          axios.post("class-teacher/assign-teacher", {
            subjectName,
            teacherId: subject.theoryTeacher,
            role: "theoryTeacher",
            previousTeacherId: previousTheoryTeacher, // ✅ Pass previous teacher ID
          })
        );
      }

      if (subject.assignmentTeacher) {
        requests.push(
          axios.post("class-teacher/assign-teacher", {
            subjectName,
            teacherId: subject.assignmentTeacher,
            role: "assignmentTeacher",
            previousTeacherId: previousAssignmentTeacher, // ✅ Pass previous teacher ID
          })
        );
      }

      await Promise.all(requests);

      console.log("Updated subjects:", subjects);

      // Exit edit mode after updating
      setEditMode((prev) => ({ ...prev, [subjectName]: false }));
    } catch (err) {
      console.error("Error updating teacher assignment:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="spinner-border animate-spin border-4 border-blue-500 rounded-full w-12 h-12"></div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Assign Teachers</h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4">Subject Name</th>
                <th className="p-4">Theory Teacher</th>
                <th className="p-4">Assignment Teacher</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.name} className="border-b hover:bg-gray-50">
                  <td className="p-4">{subject.name}</td>

                  {/* Theory Teacher */}
                  <td className="p-4">
                    {editMode[subject.name] ? (
                      <select
                        className="border p-2 rounded-lg"
                        value={
                          selectedTeachers[subject.name]?.theoryTeacher || ""
                        }
                        onChange={(e) =>
                          handleTeacherChange(
                            subject.name,
                            e.target.value,
                            "theoryTeacher"
                          )
                        }
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>
                        {teachers.find(
                          (t) =>
                            t._id ===
                            selectedTeachers[subject.name]?.theoryTeacher
                        )?.name || "N/A"}
                      </span>
                    )}
                  </td>

                  {/* Assignment Teacher */}
                  <td className="p-4">
                    {editMode[subject.name] ? (
                      <select
                        className="border p-2 rounded-lg"
                        value={
                          selectedTeachers[subject.name]?.assignmentTeacher ||
                          ""
                        }
                        onChange={(e) =>
                          handleTeacherChange(
                            subject.name,
                            e.target.value,
                            "assignmentTeacher"
                          )
                        }
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>
                        {teachers.find(
                          (t) =>
                            t._id ===
                            selectedTeachers[subject.name]?.assignmentTeacher
                        )?.name || "N/A"}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    {editMode[subject.name] ? (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={() => handleUpdate(subject.name)}
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        onClick={() =>
                          setEditMode((prev) => ({
                            ...prev,
                            [subject.name]: true,
                          }))
                        }
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default SubjectView;
