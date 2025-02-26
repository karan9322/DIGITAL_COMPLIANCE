// StudentView.jsx
import { useState, useEffect } from "react";
import axios from "../../../services/api";

const StudentView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rollNumber");
  const [loading, setLoading] = useState(false);

  const handleSearch = (event) => setSearchQuery(event.target.value);
  const handleStatusFilter = (event) => setStatusFilter(event.target.value);
  const handleSortChange = (event) => setSortBy(event.target.value);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/class-teacher/students");
      setStudents(data.students);
      console.log("student", data);
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filterAndSortStudents = (students) => {
    const filteredStudents = students
      .filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.rollNumber.toString().includes(searchQuery)
      )
      .filter(
        (student) => statusFilter === "all" || student.status === statusFilter
      );

    return filteredStudents.sort((a, b) => {
      return sortBy === "rollNumber"
        ? a.rollNumber - b.rollNumber
        : a.name.localeCompare(b.name);
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="spinner-border animate-spin border-4 border-blue-500 rounded-full w-12 h-12"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              className="border p-3 rounded-lg w-64"
              placeholder="Search by name or roll number"
              value={searchQuery}
              onChange={handleSearch}
            />
            <select
              className="border p-3 rounded-lg"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              className="border p-3 rounded-lg"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="rollNumber">Sort by Roll Number</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4">Roll Number</th>
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterAndSortStudents(students).map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{student.rollNumber}</td>
                  <td className="p-4">{student.name}</td>
                  <td className="p-4 font-semibold">
                    {student.status.classTeacherStatus || "Pending"}
                  </td>
                  <td className="p-4">
                    {student.status.classTeacherStatus === "pending" && (
                      <>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">
                          Approve
                        </button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                          Reject
                        </button>
                      </>
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

export default StudentView;
