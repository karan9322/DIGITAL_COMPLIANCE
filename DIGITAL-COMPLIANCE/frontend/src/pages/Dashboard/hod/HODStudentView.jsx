import { useEffect, useState } from "react";
import axios from "../../../services/api";
import { toast } from "react-toastify";

const HODStudentView = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/hod/students");
        setStudents(data.students);
      } catch (err) {
        console.error("Error fetching students:", err);
        toast.error(err.response?.data?.message || "Error loading students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (event) => setSearchQuery(event.target.value);
  const handleStatusFilter = (event) => setStatusFilter(event.target.value);

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const filterStudents = () => {
    return students
      .filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNumber.toString().includes(searchQuery)
      )
      .filter(
        (student) => statusFilter === "all" || student.status === statusFilter
      );
  };

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="border border-gray-300 p-3 rounded-lg shadow-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search by name or roll number"
            value={searchQuery}
            onChange={handleSearch}
          />
          <select
            className="border border-gray-300 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 ml-4"
            value={statusFilter}
            onChange={handleStatusFilter}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button
          className={`bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors ${
            selectedStudents.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={selectedStudents.length === 0}
        >
          Approve All
        </button>
      </div>

      {/* Student Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="spinner-border animate-spin border-4 border-blue-500 rounded-full w-12 h-12"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4 font-medium text-gray-600">
                  <input
                    type="checkbox"
                    onChange={() =>
                      setSelectedStudents(
                        selectedStudents.length === students.length
                          ? []
                          : students.map((s) => s._id)
                      )
                    }
                    checked={selectedStudents.length === students.length}
                  />
                </th>
                <th className="p-4 font-medium text-gray-600">Roll Number</th>
                <th className="p-4 font-medium text-gray-600">Name</th>
                <th className="p-4 font-medium text-gray-600">Status</th>
                <th className="p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterStudents().map((student) => (
                <tr
                  key={student._id}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      onChange={() => handleSelectStudent(student._id)}
                      checked={selectedStudents.includes(student._id)}
                    />
                  </td>
                  <td className="p-4">{student.rollNumber}</td>
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">
                    <span
                      className={`${
                        student.status.hodStatus === "pending"
                          ? "text-yellow-600"
                          : student.status.hodStatus === "approved"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-semibold`}
                    >
                      {student.status.hodStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    {student.status.hodStatus === "pending" && (
                      <>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-all mr-4">
                          Approve
                        </button>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-all">
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HODStudentView;
