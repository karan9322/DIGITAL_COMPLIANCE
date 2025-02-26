import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/api"; // Import the axios instance

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeDivision, setActiveDivision] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState([]); // Initialize as an empty array
  const [selectedType, setSelectedType] = useState("theory");

  // Default to first division if available
  useEffect(() => {
    if (user && user.subject.length > 0) {
      setActiveDivision(user.subject[0].division);
      setTeacherDetails(user.subject[0]);

      // Determine user roles for the first division
      const firstDivisionSubjects = user.subject[0];
      const hasTheoryRole = firstDivisionSubjects.role === "theoryTeacher";
      const hasAssignmentRole =
        firstDivisionSubjects.role === "assignmentTeacher";

      if (hasTheoryRole) {
        setSelectedType("theory");
      } else if (hasAssignmentRole) {
        setSelectedType("assignment");
      }
    }
  }, [user]);

  const handleDivisionClick = async (division) => {
    setActiveDivision(division);
    setStudents([]); // Clear students data before fetching new data
    setLoading(true);

    // Get all subjects for the selected division
    const subjectsForDivision = user.subject.filter(
      (subject) => subject.division === division
    );
    setTeacherDetails(subjectsForDivision); // Store subjects array (handles multiple subjects per teacher)

    try {
      const response = await axios.get(`/teacher/students/${division}`);
      setStudents(response.data); // Set students list for the selected division
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.subject || user.subject.length === 0) {
    return <p>No division data available.</p>;
  }

  const divisions = [
    ...new Set(user.subject.map((subject) => subject.division)),
  ];

  const handleApprove = (studentId, statusType) => {
    console.log(`Approved ${statusType} for student:`, studentId);
    // Send API request to approve theory or assignment separately
  };

  const handleReject = (studentId, statusType) => {
    console.log(`Rejected ${statusType} for student:`, studentId);
    // Send API request to reject theory or assignment separately
  };

  const getTeacherStatus = (student) => {
    if (user.role === "teacher" && Array.isArray(teacherDetails)) {
      const subjectStatuses = student.status.subjects.filter((subject) =>
        teacherDetails.some(
          (teacherSubject) =>
            teacherSubject.name === subject.subjectStatusSchema
        )
      );

      if (subjectStatuses.length === 0) {
        return {
          theoryStatus: "No status",
          assignmentStatus: "No status",
          roles: [], // Ensure roles is always an array
        };
      }

      const status = {
        theoryStatus: "No status",
        assignmentStatus: "No status",
        roles: [], // Ensure roles is always an array
      };

      subjectStatuses.forEach((subject) => {
        const teacherSubjects = teacherDetails.filter(
          (teacher) => teacher.name === subject.subjectStatusSchema
        );

        if (teacherSubjects.length > 0) {
          status.theoryStatus = subject.theoryStatus ?? "No status";
          status.assignmentStatus = subject.practicalStatus ?? "No status";

          teacherSubjects.forEach((teacherSubject) => {
            status.roles.push(teacherSubject.role); // Capture all roles for the teacher
          });
        }
      });

      return status;
    }

    return {
      theoryStatus: student.status.classTeacherStatus ?? "No status",
      assignmentStatus: student.status.hodStatus ?? "No status",
      roles: [], // Ensure roles is always an array
    };
  };

  const ActionButtons = ({ studentId, handleApprove, handleReject }) => {
    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleApprove(studentId, selectedType)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Approve {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
        </button>
        <button
          onClick={() => handleReject(studentId, selectedType)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Reject {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
        </button>
      </div>
    );
  };

  return (
    <div className="teacher-dashboard p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Divisions</h2>
      <div className="flex flex-wrap gap-6 mb-6">
        {divisions.map((division) => (
          <div
            key={division} // Use division as the key
            className={`p-4 rounded-lg shadow-md w-auto text-center cursor-pointer transition-colors duration-300 ${
              activeDivision === division
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-black"
            }`}
            onClick={() => handleDivisionClick(division)}
          >
            <h3 className="text-xl font-medium mb-2">{division}</h3>
          </div>
        ))}
      </div>

      {/* Display teacher info for selected division */}
      <div className="flex mb-6 p-4 shadow-md gap-48">
        {teacherDetails && teacherDetails.length > 0 && (
          <div className="">
            <div className="text-xl font-semibold text-gray-800">
              Division {activeDivision}
            </div>

            {teacherDetails.map((subject, index) => (
              <div
                key={index}
                className="text-lg font-medium flex gap-5 text-gray-800"
              >
                <strong>Subject:</strong> {subject.name} <br />
                <strong>Role:</strong> {subject.role}{" "}
                {/* Role could be "theory" or "assignment" */}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-4 mb-4">
          <span
            className={`px-2 py-1 rounded-lg ${
              selectedType === "theory"
                ? "bg-blue-500 text-white font-bold"
                : "text-gray-500"
            }`}
          >
            Theory
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={selectedType === "assignment"}
              onChange={() => {
                const teacherRoles = teacherDetails.map(
                  (subject) => subject.role
                ); // Move this line here

                if (
                  teacherRoles.includes("theoryTeacher") &&
                  teacherRoles.includes("assignmentTeacher")
                ) {
                  setSelectedType(
                    selectedType === "theory" ? "assignment" : "theory"
                  );
                }
              }}
              disabled={
                !Array.isArray(teacherDetails) ||
                !teacherDetails.some(
                  (subject) => subject.role === "theoryTeacher"
                ) ||
                !teacherDetails.some(
                  (subject) => subject.role === "assignmentTeacher"
                )
              }
            />
            <div
              className={`w-12 h-6 ${
                selectedType === "assignment" ? "bg-blue-500" : "bg-gray-300"
              } rounded-full relative`}
            >
              <div
                className={`absolute top-1/2 left-1 bg-white border-gray-300 border rounded-full h-5 w-5 transition-all transform -translate-y-1/2 ${
                  selectedType === "assignment" ? "translate-x-6" : ""
                }`}
              ></div>
            </div>
          </label>

          <span
            className={`px-2 py-1 rounded-lg ${
              selectedType === "assignment"
                ? "bg-blue-500 text-white font-bold"
                : "text-gray-500"
            }`}
          >
            Assignment
          </span>
        </div>
      </div>

      {/* Display students */}
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <div className="overflow-x-auto">
          {students.length > 0 ? (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Roll Number</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Theory Status</th>
                  <th className="px-4 py-2 text-left">Assignment Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const {
                    theoryStatus,
                    assignmentStatus,
                    roles = [],
                  } = getTeacherStatus(student);

                  const isTheoryTeacher = roles.includes("theoryTeacher");
                  const isAssignmentTeacher =
                    roles.includes("assignmentTeacher");

                  return (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{student.rollNumber}</td>
                      <td className="px-4 py-2">{student.name}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            theoryStatus.includes("approved")
                              ? "bg-green-100 text-green-600"
                              : theoryStatus.includes("pending")
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {theoryStatus}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            assignmentStatus.includes("approved")
                              ? "bg-green-100 text-green-600"
                              : assignmentStatus.includes("pending")
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {assignmentStatus}
                        </span>
                      </td>

                      <td className="px-4 py-2">
                        <ActionButtons
                          studentId={student.id}
                          roles={roles}
                          handleApprove={handleApprove}
                          handleReject={handleReject}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No students found for this division.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
