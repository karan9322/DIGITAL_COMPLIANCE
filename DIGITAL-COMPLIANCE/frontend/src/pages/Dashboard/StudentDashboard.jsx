import { useEffect, useState } from "react";
import axios from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [classTeacher, setClassTeacher] = useState("");
  const [hod, setHod] = useState("");
  const [marks, setMarks] = useState({});
  const [submittedMarks, setSubmittedMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModes, setEditModes] = useState({});

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await axios.get("/student/subjects");
        setSubjects(data.status.subjects);
        setClassTeacher(data.status.classTeacherStatus);
        setHod(data.status.hodStatus);

        const initialEditModes = {};
        data.subjects.forEach((subject) => {
          initialEditModes[subject.subjectStatusSchema] =
            !submittedMarks[subject.subjectStatusSchema];
        });
        setEditModes(initialEditModes);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        toast.error("Error loading subjects");
      }
      setLoading(false);
    };

    fetchSubjects();
  }, [submittedMarks]);

  const handleMarksChange = (subjectName, value) => {
    setMarks((prev) => ({
      ...prev,
      [subjectName]: value,
    }));
  };

  const submitMarks = async (subjectName) => {
    const prelimMarks = marks[subjectName];

    if (!prelimMarks) {
      toast.error("Please enter prelims marks before submitting.");
      return;
    }

    try {
      await axios.post(`/student/marks/${subjectName}`, {
        marks: prelimMarks,
      });

      setSubmittedMarks((prev) => ({
        ...prev,
        [subjectName]: true,
      }));

      setEditModes((prev) => ({
        ...prev,
        [subjectName]: false,
      }));

      toast.success("Marks submitted successfully");
    } catch (err) {
      console.error("Error submitting marks:", err);
      toast.error("Failed to submit marks");
    }
  };

  const toggleEditMode = (subjectName) => {
    setEditModes((prev) => ({
      ...prev,
      [subjectName]: !prev[subjectName],
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Student Dashboard
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {subjects.map((subject) => (
              <div
                key={subject.subjectStatusSchema}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                style={{ maxHeight: "340px" }}
              >
                <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
                  {subject.subjectStatusSchema}
                </h3>

                {editModes[subject.subjectStatusSchema] ? (
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Prelims Marks
                      </label>
                      <input
                        type="number"
                        value={marks[subject.subjectStatusSchema] || ""}
                        onChange={(e) =>
                          handleMarksChange(
                            subject.subjectStatusSchema,
                            e.target.value
                          )
                        }
                        className="border rounded-lg w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => submitMarks(subject.subjectStatusSchema)}
                      className="mt-4 w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                    >
                      Save Marks
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex gap-5 items-center">
                        <span className="text-lg text-gray-700 font-semibold">
                          Marks:
                        </span>
                        <span className="text-lg font-semibold">
                          {subject.marks}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2 items-center mt-4">
                        <span className="text-lg text-gray-700 font-semibold">
                          Practical:
                        </span>
                        <span
                          className={`text-sm font-bold px-3 py-1 rounded-full ${
                            subject.practicalStatus === "approved"
                              ? "bg-green-100 text-green-600"
                              : subject.practicalStatus === "rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {subject.practicalStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-lg text-gray-700 font-semibold">
                          Theory:
                        </span>
                        <span
                          className={`text-sm font-bold px-3 py-1 rounded-full ${
                            subject.theoryStatus === "approved"
                              ? "bg-green-100 text-green-600"
                              : subject.theoryStatus === "rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {subject.theoryStatus}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        toggleEditMode(subject.subjectStatusSchema)
                      }
                      className="mt-4 w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                    >
                      Edit Marks
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mt-10 ">
            <div className="border rounded-xl shadow-md p-4 bg-white flex flex-col justify-between w-full max-w-sm transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">
                  Class Teacher
                </span>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    classTeacher === "approved"
                      ? "bg-green-100 text-green-600"
                      : classTeacher === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {classTeacher}
                </span>
              </div>
            </div>

            <div className="border rounded-xl shadow-md p-4 bg-white flex flex-col justify-between w-full max-w-sm transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">
                  Head of Department
                </span>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    hod === "approved"
                      ? "bg-green-100 text-green-600"
                      : hod === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {hod}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
