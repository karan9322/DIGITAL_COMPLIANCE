import { useState } from "react";
import HODStudentView from "./HODStudentView";
import HODTeacherView from "./HODTeacherView"; // Placeholder for teacher section

const HODDashboard = () => {
  const [selectedView, setSelectedView] = useState("students");

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-4xl font-semibold text-gray-800">HOD Dashboard</h2>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedView("students")}
          className={`px-6 py-3 rounded-lg ${
            selectedView === "students"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-blue-100"
          }`}
        >
          Students
        </button>

        <button
          onClick={() => setSelectedView("teachers")}
          className={`px-6 py-3 rounded-lg ${
            selectedView === "teachers"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-blue-100"
          }`}
        >
          Teachers
        </button>
      </div>

      {/* Render Views */}
      {selectedView === "students" ? <HODStudentView /> : <HODTeacherView />}
    </div>
  );
};

export default HODDashboard;
