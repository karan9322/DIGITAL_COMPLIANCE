import { FaTimes, FaUserCircle } from "react-icons/fa";

const UserProfileModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes className="text-2xl" />
        </button>

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400" />
          )}

          <h2 className="text-xl font-semibold text-gray-900 mt-3 capitalize">
            {user.name}
          </h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        {/* User Details */}
        <div className="mt-5 border-t pt-4 text-gray-700">
          <div className="mb-2">
            <span className="font-medium">Role:</span> {user.role}
          </div>

          {user.role === "student" ? (
            <>
              <div className="mb-2">
                <span className="font-medium">Roll Number:</span>{" "}
                {user.rollNumber}
              </div>
              <div className="mb-2">
                <span className="font-medium">Branch:</span> {user.branch}
              </div>
              <div className="mb-2">
                <span className="font-medium">Year:</span> {user.year}
              </div>
              <div className="mb-2">
                <span className="font-medium">Semester:</span> {user.semester}
              </div>
              <div className="mb-2">
                <span className="font-medium">Division:</span> {user.division}
              </div>
            </>
          ) : (
            <>
              <div className="mb-2">
                <span className="font-medium">Branch:</span> {user.branch}
              </div>
              <div className="mb-2">
                <span className="font-medium">Subject:</span> {user.subject}
              </div>
            </>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
