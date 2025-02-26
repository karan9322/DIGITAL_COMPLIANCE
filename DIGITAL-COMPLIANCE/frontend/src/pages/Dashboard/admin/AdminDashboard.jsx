import { useState } from "react";
import AdminTeacher from "./AdminTeacher";
import AdminCompliance from "./AdminCompliance";
import AdminClass from "./AdminClass";

const AdminDashboard = () => {
  const [section, setSection] = useState("students");

  return (
    <div className="p-6 lg:p-12 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-md mb-8">
        <h1 className="text-4xl font-bold text-center">Admin Dashboard</h1>
      </header>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-8">
        {["students", "teachers", "compliance", "classes"].map((item) => (
          <button
            key={item}
            className={`px-6 py-3 mx-2 font-semibold rounded-lg transition-all ${
              section === item
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setSection(item)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {section === "students" && (
          <p>Students section is under development.</p>
        )}
        {section === "teachers" && <AdminTeacher />}
        {section === "compliance" && <AdminCompliance />}
        {section === "classes" && <AdminClass />}
      </div>
    </div>
  );
};

export default AdminDashboard;
