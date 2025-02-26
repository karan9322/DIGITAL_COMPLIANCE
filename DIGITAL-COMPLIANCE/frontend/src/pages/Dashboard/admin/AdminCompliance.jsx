import { useState, useEffect } from "react";
import axios from "../../../services/api";
import { toast } from "react-toastify";

const AdminCompliance = () => {
  const [view, setView] = useState("view");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: "",
  });
  const [subjects, setSubjects] = useState([]); // State to store the list of subjects

  useEffect(() => {
    if (view === "view") {
      fetchForms();
    }
  }, [view]);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/admin/compliance-forms");
      setForms(response.data.complianceForms || []);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Failed to fetch compliance forms.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!year || !branch || !semester || subjects.length === 0) {
      toast.error("Please fill in all required fields and add subjects!");
      return;
    }

    try {
      const response = await axios.post("/admin/compliance-forms", {
        year,
        branch,
        semester,
        subjects,
      });
      toast.success(
        response.data.message || "Compliance form created successfully!"
      );
      setYear("");
      setBranch("");
      setSemester("");
      setSubjects([]);
    } catch (error) {
      console.error("Error creating compliance form:", error);
      toast.error("Failed to create compliance form.");
    }
  };

  const handleViewDetails = (form) => {
    setSelectedForm(form);
    setView("view-details");
  };

  const handleAddSubject = () => {
    if (!newSubject.name) {
      toast.error("Please fill in all subject fields.");
      return;
    }

    // Add new subject to the subjects list
    setSubjects([...subjects, newSubject]);
    setNewSubject({ name: "" });
  };

  const handleRemoveSubject = (index) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);
  };

  return (
    <div className="bg-white p-6 ">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        Compliance Forms
      </h3>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded shadow ${
            view === "create"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setView("create")}
        >
          Create Form
        </button>
        <button
          className={`px-4 py-2 rounded shadow ${
            view === "view"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setView("view")}
        >
          View Forms
        </button>
      </div>

      {view === "create" ? (
        <div className="bg-gray-100 p-6 rounded shadow">
          <h4 className="font-semibold mb-4">Create Compliance Form</h4>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <select
                className="border px-4 py-2 rounded"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Select Year</option>
                {["1", "2", "3", "4"].map((yr, idx) => (
                  <option key={idx} value={yr}>
                    {yr} year
                  </option>
                ))}
              </select>

              <select
                className="border px-4 py-2 rounded"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="">Select Branch</option>
                {[
                  "Computer",
                  "Electrical",
                  "Electronics and Telecommunication",
                  "Information Technology",
                  "AI and ML",
                ].map((br, idx) => (
                  <option key={idx} value={br}>
                    {br}
                  </option>
                ))}
              </select>

              <select
                className="border px-4 py-2 rounded"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="">Select Semester</option>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Subject Fields */}
            <div className="mb-6">
              <h5 className="font-semibold mb-2">Add Subject and Teachers</h5>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  className="border px-4 py-2 rounded w-full"
                  placeholder="Subject Name"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                />

                <button
                  type="button"
                  className="bg-blue-600 text-white rounded hover:bg-blue-700 w-full flex items-center justify-center"
                  onClick={handleAddSubject}
                >
                  Add Subject
                </button>
              </div>

              {/* Display Added Subjects */}
              {subjects.length > 0 && (
                <div className="space-y-4">
                  {subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white rounded shadow hover:shadow-lg"
                    >
                      <div>
                        <p>
                          <strong>{subject.name}</strong>
                        </p>
                      </div>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveSubject(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded shadow hover:bg-purple-700 w-full"
            >
              Submit Compliance Form
            </button>
          </form>
        </div>
      ) : view === "view-details" && selectedForm ? (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-5xl mx-auto">
          <h4 className="font-semibold text-lg text-gray-800 mb-4">
            Compliance Form Details
          </h4>

          <div className="flex gap-5 mb-4 align-middle ">
            <p className="text-gray-600 text-sm">
              <strong>Year:</strong> {selectedForm.year}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Branch:</strong> {selectedForm.branch}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Semester:</strong> {selectedForm.semester}
            </p>
          </div>

          <h5 className="font-semibold text-md text-gray-800 mb-2">Subjects</h5>

          <div className="grid grid-cols-5 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {selectedForm.subjects.map((subject, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm hover:scale-105  transition-all duration-300 ease-in-out"
              >
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-semibold text-gray-800">
                    {subject.name}
                  </div>

                  <div className="text-xs text-gray-600">
                    <strong className="text-gray-800">Theory:</strong>{" "}
                    {subject.theoryTeacher}
                  </div>

                  <div className="text-xs text-gray-600">
                    <strong className="text-gray-800">Assignment:</strong>{" "}
                    {subject.assignmentTeacher}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setView("view")}
            className="mt-4 w-full px-6 py-2 bg-gray-700 text-white rounded-lg shadow-sm hover:bg-gray-800 transition-all duration-300"
          >
            Back to List
          </button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-5xl mx-auto">
          <h4 className="font-semibold mb-4">Previous Compliance Forms</h4>
          {loading ? (
            <p>Loading...</p>
          ) : forms.length === 0 ? (
            <p>No compliance forms available.</p>
          ) : (
            <div className="flex flex-wrap gap-4 justify-start">
              {forms.map((form) => (
                <div
                  key={form._id}
                  className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between w-auto"
                >
                  <div>
                    <p>
                      <strong>Year:</strong> {form.year}
                    </p>
                    <p>
                      <strong>Branch:</strong> {form.branch}
                    </p>
                    <p>
                      <strong>Semester:</strong> {form.semester}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                      onClick={() => handleViewDetails(form)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCompliance;
