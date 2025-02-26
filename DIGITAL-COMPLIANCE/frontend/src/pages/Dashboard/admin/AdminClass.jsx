import { useState, useEffect } from "react";
import axios from "../../../services/api"; // Import your axios instance
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget to import the styles

const AdminClass = () => {
  const [section, setSection] = useState("create");
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    year: "",
    branch: "",
    divisions: [
      { name: "", classTeacher: "", subDivisions: [{ name: "", mentor: "" }] },
    ],
  });

  // Predefined branch options can be replaced with an API call if available
  const branchOptions = [
    "Computer",
    "Electrical",
    "Electronics and Telecommunication",
    "Information Technology",
    "AI and ML",
  ];

  useEffect(() => {
    if (section === "view") {
      fetchClasses();
    }
  }, [section]); // Fetch classes only when the section is set to "view"

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/admin/classes"); // Replace with actual API endpoint
      setClasses(response.data || []);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  const handleChange = (e, index, subIndex) => {
    const { name, value } = e.target;
    let updatedDivisions = [...formData.divisions];

    if (name === "division") {
      updatedDivisions[index].name = value;
    } else if (name === "subdivision") {
      updatedDivisions[index].subDivisions[subIndex] = {
        ...updatedDivisions[index].subDivisions[subIndex], // ✅ Keep existing fields
        name: value,
      };
    }

    setFormData({ ...formData, divisions: updatedDivisions });
  };

  const addDivision = () => {
    setFormData({
      ...formData,
      divisions: [
        ...formData.divisions,
        {
          name: "",
          classTeacher: "",
          subDivisions: [{ name: "", mentor: "" }],
        },
      ],
    });
  };

  const addSubdivision = (index) => {
    let updatedDivisions = [...formData.divisions];

    // Push a new object for the subdivision, ensuring the structure matches
    updatedDivisions[index].subDivisions.push({ name: "", mentor: "" });

    setFormData({ ...formData, divisions: updatedDivisions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("formData", formData);
      const response = await axios.post("/admin/classes", formData); // Replace with actual API endpoint
      console.log("Class created successfully:", response.data);

      // Reset the form data to default values
      setFormData({
        year: "",
        branch: "",
        divisions: [
          {
            name: "",
            classTeacher: "",
            subDivisions: [{ name: "", mentor: "" }],
          },
        ],
      });

      // Display success toast
      toast.success("Class created successfully!");
    } catch (error) {
      console.error("Failed to create class:", error);

      // Display error toast
      toast.error("Failed to create class. Please try again.");
    }
  };

  return (
    <div className="p-6">
      {/* Toast Container */}
      <ToastContainer />

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6">
        {["create", "view"].map((item) => (
          <button
            key={item}
            className={`px-6 py-2 mx-2 font-semibold rounded-lg transition-all ${
              section === item
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setSection(item)}
          >
            {item === "create" ? "Create Class" : "View Classes"}
          </button>
        ))}
      </div>

      {/* Create Class Section */}
      {section === "create" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <select
                className="w-full p-2 border rounded"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                required
              >
                <option value="">Select Year</option>
                {[1, 2, 3, 4].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                name="branch"
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                className="p-2 border mb-5 rounded-md"
              >
                <option value="" disabled>
                  Select Branch
                </option>
                {branchOptions.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Divisions */}
          <div className="space-y-4">
            {formData.divisions.map((division, divIndex) => (
              <div
                key={divIndex}
                className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex flex-wrap items-center gap-4"
              >
                {/* Division Input */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-semibold">Division:</label>
                  <input
                    type="text"
                    maxLength="1"
                    className="w-12 h-10 text-lg font-bold border rounded-lg text-center focus:ring-2 focus:ring-blue-400"
                    placeholder={String.fromCharCode(65 + divIndex)} // A, B, C
                    value={division.name}
                    onChange={(e) => {
                      const updatedDivisions = [...formData.divisions];
                      updatedDivisions[divIndex].name =
                        e.target.value.toUpperCase();
                      setFormData({ ...formData, divisions: updatedDivisions });
                    }}
                  />
                </div>

                {/* Subdivisions */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-semibold">Subdivisions:</label>
                  <div className="flex flex-wrap gap-2">
                    {division.subDivisions.map((sub, subIndex) => {
                      // Ensure sub is always a valid object
                      if (!sub || typeof sub !== "object") return null;

                      return (
                        <input
                          key={subIndex}
                          type="text"
                          className="w-14 h-10 text-lg border rounded-lg text-center focus:ring-2 focus:ring-green-400"
                          placeholder={`${
                            division.name || String.fromCharCode(65 + divIndex)
                          }${subIndex + 1}`} // A1, A2
                          value={sub.name || ""} // ✅ Prevent error by ensuring it's always a string
                          onChange={(e) => {
                            const updatedDivisions = [...formData.divisions];
                            updatedDivisions[divIndex].subDivisions[subIndex] =
                              {
                                ...updatedDivisions[divIndex].subDivisions[
                                  subIndex
                                ], // ✅ Keep existing values
                                name: e.target.value.toUpperCase(),
                              };
                            setFormData({
                              ...formData,
                              divisions: updatedDivisions,
                            });
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Add Subdivision Button */}
                  <button
                    type="button"
                    className="px-3 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                    onClick={() => {
                      const updatedDivisions = [...formData.divisions];
                      updatedDivisions[divIndex].subDivisions.push({
                        name: "",
                        mentor: "",
                      });
                      setFormData({ ...formData, divisions: updatedDivisions });
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            {/* Add Division Button */}
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
              onClick={() =>
                setFormData({
                  ...formData,
                  divisions: [
                    ...formData.divisions,
                    {
                      name: "",
                      classTeacher: "",
                      subDivisions: [{ name: "", mentor: "" }],
                    }, // ✅ Correct format
                  ],
                })
              }
            >
              + Add Division
            </button>
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
          >
            Create Class
          </button>
        </form>
      )}

      {/* View Classes Section */}
      {section === "view" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white p-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                {/* Showing only the essentials */}
                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    <strong>Branch:</strong> {cls.branch}
                  </p>
                  <p>
                    <strong>Year:</strong> {cls.year}
                  </p>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => {
                    // Handle View Details functionality here (e.g., toggle visibility of divisions)
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p>No classes found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminClass;
