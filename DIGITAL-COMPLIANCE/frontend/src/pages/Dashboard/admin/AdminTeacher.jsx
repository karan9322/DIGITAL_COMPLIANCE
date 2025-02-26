import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "../../../services/api";
import { toast } from "react-toastify";

const AdminTeacher = () => {
  const [view, setView] = useState("view"); // "view" for viewing teachers list, "add" for adding a teacher
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
    subject: [],
    role: "",
    year: "",
    branch: "",
    semester: "",
    division: "",
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const yearOptions = ["1", "2", "3", "4"];
  const branchOptions = [
    "Computer",
    "Electronics and Telecommunication",
    "Information Technology",
    "AI and ML",
    "Electrical",
  ];

  useEffect(() => {
    if (view === "view") {
      fetchTeachers();
    }
  }, [view]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/admin/teachers");
      console.log("response", response);
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to fetch teachers.");
    } finally {
      setLoading(false);
    }
  };

  // Filtering teachers based on search and role filter
  const filteredTeachers = teachers.filter((teacher) => {
    const nameOrSubjectMatch =
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(teacher.subject)
        ? teacher.subject.some((sub) =>
            sub.toLowerCase().includes(search.toLowerCase())
          )
        : teacher.subject?.toLowerCase().includes(search.toLowerCase()));

    const roleMatch = roleFilter
      ? teacher.role.toLowerCase() === roleFilter.toLowerCase()
      : true;

    return nameOrSubjectMatch && roleMatch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("newTeacher", newTeacher);
      const response = await axios.post("/admin/teachers", newTeacher);
      toast.success(response.data.message || "Teacher added successfully!");
      setNewTeacher({
        name: "",
        email: "",
        password: "",
        subject: [],
        role: "",
        year: "",
        branch: "",
        semester: "",
        division: "",
      });
      fetchTeachers(); // Fetch updated list
      setView("view"); // Return to view mode after adding
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast.error("Failed to add teacher.");
    }
  };

  const handleViewDetails = (teacher) => {
    console.log(teacher);
  };

  return (
    <div className="bg-white p-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Teachers</h3>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded shadow ${
            view === "add"
              ? "bg-gradient-to-br from-green-400 to-green-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setView("add")}
        >
          Add Teacher
        </button>
        <button
          className={`px-4 py-2 rounded shadow ${
            view === "view"
              ? "bg-gradient-to-br from-green-400 to-green-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setView("view")}
        >
          View Teachers
        </button>
      </div>

      {view === "add" ? (
        <div className="bg-gray-100 p-6 rounded shadow w-full">
          <h4 className="font-semibold mb-4 text-lg">Add Teacher</h4>
          <form onSubmit={handleSubmit}>
            {/* Common Details */}
            <div className="flex space-x-4 mb-6">
              <input
                type="text"
                className="w-full p-3 border rounded"
                placeholder="Teacher Name"
                value={newTeacher.name}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, name: e.target.value })
                }
              />
              <input
                type="email"
                className="w-full p-3 border rounded"
                placeholder="Teacher Email"
                value={newTeacher.email}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, email: e.target.value })
                }
              />
            </div>

            <div className="flex space-x-4 mb-6">
              <input
                type="password"
                className="w-full p-3 border rounded"
                placeholder="Teacher Password"
                value={newTeacher.password}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, password: e.target.value })
                }
              />
              <select
                className="w-full p-3 border rounded"
                value={newTeacher.branch}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, branch: e.target.value })
                }
              >
                <option value="">Branch</option>
                {branchOptions.map((branch, idx) => (
                  <option key={idx} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-3 border rounded"
                value={newTeacher.role}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, role: e.target.value })
                }
              >
                <option value="">Select Role</option>
                <option value="teacher">Add Teacher</option>
                <option value="admin">Add Admin</option>
                <option value="hod">Add HOD</option>
              </select>
            </div>

            {/* Dynamic Fields Based on Role */}
            {newTeacher.role === "teacher" && (
              <>
                <div className="flex space-x-4 mb-4">
                  <select
                    className="w-full p-3 border rounded"
                    value={newTeacher.year}
                    onChange={(e) =>
                      setNewTeacher({ ...newTeacher, year: e.target.value })
                    }
                  >
                    <option value="">Year</option>
                    {yearOptions.map((yr, idx) => (
                      <option key={idx} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-br from-green-400 to-green-500 text-white rounded shadow hover:bg-purple-700 w-full"
            >
              Add Teacher
            </button>
          </form>
        </div>
      ) : view === "view" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
              <input
                type="text"
                placeholder="Search by Name or Subject"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
              />

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border rounded-md shadow-sm"
              >
                <option value="">All Roles</option>
                <option value="teacher">Teacher</option>
                <option value="classTeacher">Class Teacher</option>
                <option value="hod">HOD</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : filteredTeachers.length === 0 ? (
              <p className="text-gray-500">No teachers available.</p>
            ) : (
              <div className="overflow-x-auto bg-white p-6 shadow-lg rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Teacher List
                </h3>
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((teacher, index) => (
                      <tr
                        key={teacher._id}
                        className={`border-t border-gray-200 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100 transition`}
                      >
                        <td className="py-4 px-4 text-gray-700">
                          {teacher.name}
                        </td>

                        <td className="py-4 px-4 text-gray-700">
                          {teacher.role}
                        </td>
                        <td className="py-4 px-4 text-center flex gap-2 justify-center">
                          <button
                            onClick={() => handleViewDetails(teacher)}
                            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow-md hover:bg-blue-600 transition"
                          >
                            View
                          </button>
                          <button className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md shadow-md hover:bg-green-600 transition">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
};

export default AdminTeacher;
