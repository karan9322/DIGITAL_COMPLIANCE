import { useEffect, useState } from "react";
import axios from "../../../services/api";
import { FaCheckCircle, FaUserPlus } from "react-icons/fa";

const HODTeacherView = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState({}); // Track assigned teachers

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, [assignments]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/hod/classes");
      setClasses(response.data || []);
      console.log("karan", response.data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("/hod/teachers");
      setTeachers(response.data || []);
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleAssignTeacher = async (divisionId, year, teacherId, semester) => {
    if (!teacherId) return;
    setLoading(true);
    try {
      console.log("narak", teacherId, year, divisionId, semester);
      await axios.post("/hod/assign-teacher", {
        divisionId,
        year,
        teacherId,
        semester,
      });
      setAssignments((prev) => ({ ...prev, [divisionId]: teacherId }));
    } catch (error) {
      console.error("Failed to assign teacher:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Assign Class Teachers
      </h2>

      {classes.length > 0 ? (
        classes
          .sort((a, b) => a.year - b.year)
          .map((cls) => (
            <div
              key={cls.year}
              className="mt-6 p-4 border rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Year {cls.year}
              </h3>

              {cls.divisions.length > 0 ? (
                <table className="w-full border-collapse bg-gray-100">
                  <thead>
                    <tr className="bg-gray-300 text-gray-700">
                      <th className="p-3 text-left">Division</th>
                      <th className="p-3 text-left">Assigned Teacher</th>
                      <th className="p-3 text-left">Semester</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.divisions.map((division) => (
                      <tr key={division.id} className="border-b">
                        <td className="p-3">{division.name}</td>
                        <td className="p-3 flex items-center space-x-2">
                          {division.classTeacher ? (
                            <span className="text-green-600 flex items-center">
                              <FaCheckCircle className="mr-2" />{" "}
                              {division.classTeacher}
                            </span>
                          ) : (
                            <span className="text-yellow-600 flex items-center">
                              <FaUserPlus className="mr-2" /> Not Assigned
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <select
                            className="p-2 border rounded-md"
                            id={`${division._id}`}
                          >
                            <option value="">Select Semester</option>
                            {[...Array(8)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                Semester {i + 1}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-3 text-center">
                          <select
                            className="p-2 border rounded-md"
                            value={assignments[division.id] || ""}
                            onChange={(e) => {
                              const semester = document.getElementById(
                                `${division._id}`
                              ).value;
                              handleAssignTeacher(
                                division.name,
                                cls.year,
                                e.target.value,
                                semester
                              );
                            }}
                          >
                            <option value="">Select Teacher</option>
                            {teachers.map((teacher) => (
                              <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 mt-4">No divisions available</p>
              )}
            </div>
          ))
      ) : (
        <p className="text-gray-500 mt-4">No classes available</p>
      )}
    </div>
  );
};

export default HODTeacherView;
