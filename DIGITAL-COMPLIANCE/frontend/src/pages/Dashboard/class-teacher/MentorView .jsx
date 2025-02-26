import { useState } from "react";
import { FiSearch, FiUser, FiMail, FiPhone } from "react-icons/fi";

const MentorView = () => {
  const [search, setSearch] = useState("");

  // Sample mentor data (replace with actual data from API)
  const mentors = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
    },
    {
      id: 3,
      name: "Robert Brown",
      email: "robert.brown@example.com",
      phone: "555-666-7777",
    },
  ];

  // Filter mentors based on search query
  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Mentor List</h3>

      {/* Search Bar */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search mentors..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Mentor Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-gray-100 p-4 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 text-white p-3 rounded-full">
                  <FiUser size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {mentor.name}
                  </h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FiMail size={14} /> {mentor.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FiPhone size={14} /> {mentor.phone}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No mentors found
          </p>
        )}
      </div>
    </div>
  );
};

export default MentorView;
