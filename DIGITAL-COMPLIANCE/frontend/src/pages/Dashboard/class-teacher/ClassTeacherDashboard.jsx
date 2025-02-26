import { useState } from "react";

import StudentView from "./StudentView";
import SubjectView from "./SubjectView"; // Renamed from TeacherView
import MentorView from "./MentorView "; // New component
import { FiUsers, FiBook, FiUserCheck } from "react-icons/fi"; // Import icons

const ClassTeacherDashboard = () => {
  const [selectedView, setSelectedView] = useState("student");

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800 text-center">
        Class Teacher Dashboard
      </h2>

      {/* View Selector */}
      <div className="flex space-x-4 mb-6 justify-center">
        {[
          { key: "student", label: "Students", icon: <FiUsers size={20} /> },
          { key: "subject", label: "Subjects", icon: <FiBook size={20} /> },
          { key: "mentor", label: "Mentors", icon: <FiUserCheck size={20} /> },
        ].map(({ key, label, icon }) => (
          <div
            key={key}
            onClick={() => setSelectedView(key)}
            className={`cursor-pointer px-6 py-3 rounded-lg flex items-center gap-2 text-center flex-1 transition-all duration-300 ${
              selectedView === key
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            {icon}
            <span>{label}</span>
          </div>
        ))}
      </div>
      {console.log("selectedView", selectedView)}
      {selectedView === "student" && <StudentView />}
      {selectedView === "subject" && <SubjectView />}
      {selectedView === "mentor" && <MentorView />}
    </div>
  );
};

export default ClassTeacherDashboard;
