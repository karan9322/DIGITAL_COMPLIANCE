import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaBars,
  FaUser,
  FaLock,
  FaIdCard,
  FaSignOutAlt,
  FaBell,
  FaTimes,
} from "react-icons/fa";

import UserProfileModal from "../components/profile";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [notifications] = useState([
    { id: 1, message: "Your compliance form has been approved." },
    { id: 2, message: "Password change successful." },
  ]);

  const notificationsRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    navigate("/");
    setLoading(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleNotificationClick = (notificationId) => {
    // Example of handling notification click
    console.log(`Notification ${notificationId} clicked`);
    setShowNotifications(false); // Close notifications after click
  };

  const userName = user?.name || "User"; // Default name if not provided

  // Close the dropdown or notification when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    if (showNotifications) setShowNotifications(false); // Close notifications if opened
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (dropdownOpen) setDropdownOpen(false); // Close dropdown if opened
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Logo and Menu Toggle */}
      <div className="flex items-center">
        <button
          aria-label="Toggle Menu"
          className="lg:hidden mr-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars className="text-2xl" />
        </button>
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Compliance Management
        </h1>
      </div>

      {/* Navigation Links */}
      <div className={`lg:flex ${menuOpen ? "block" : "hidden"} space-x-6`}>
        <button
          className={`px-3 py-2 rounded ${
            location.pathname === "/dashboard" ? "bg-gray-700" : ""
          }`}
          onClick={() => handleNavigation("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-3 py-2 rounded ${
            location.pathname === "/forms" ? "bg-gray-700" : ""
          }`}
          onClick={() => handleNavigation("/forms")}
        >
          Forms
        </button>
        <button
          className={`px-3 py-2 rounded ${
            location.pathname === "/settings" ? "bg-gray-700" : ""
          }`}
          onClick={() => handleNavigation("/settings")}
        >
          Settings
        </button>
        {user?.role === "admin" && (
          <button
            className={`px-3 py-2 rounded ${
              location.pathname === "/admin" ? "bg-gray-700" : ""
            }`}
            onClick={() => handleNavigation("/admin")}
          >
            Admin Panel
          </button>
        )}
      </div>

      {/* User and Notifications Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications Icon */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={toggleNotifications}
            className="relative p-2 rounded-full hover:bg-gray-700"
          >
            <FaBell className="text-2xl" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg z-50">
              {notifications.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">
                  No new notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-200"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <span>{notification.message}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <button
              className="flex items-center bg-gray-700 rounded-full hover:bg-gray-600"
              onClick={toggleDropdown}
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <FaUserCircle className="text-3xl" />
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          )}

          {/* User Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg z-50 transition-all ease-in-out duration-300 opacity-100 border border-gray-200">
              {/* Profile Info Section */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
                {user.profilePicture ? (
                  <img
                    src={
                      user.profilePicture || (
                        <FaUserCircle className="text-3xl" />
                      )
                    } // Default profile icon
                    alt="Profile"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <FaUserCircle className="text-3xl" />
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {user.name || "Karan Telgad"}
                  </span>{" "}
                  {/* Default name */}
                  <span className="text-xs text-gray-500">
                    {user.email || "karan123@gmail.com"}
                  </span>{" "}
                  {/* Default email */}
                </div>
              </div>
              {/* Dropdown Items */}
              <button
                className="flex items-center px-4 py-3 w-full text-left hover:bg-gray-100 transition-colors"
                onClick={() => setShowProfileModal(true)}
              >
                <FaUser className="mr-3 text-blue-600" /> User Profile
              </button>
              <button
                className="flex items-center px-4 py-3 w-full text-left hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/change-password")}
              >
                <FaLock className="mr-3 text-blue-600" /> Change Password
              </button>
              <button
                className="flex items-center px-4 py-3 w-full text-left hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/virtual-id")}
              >
                <FaIdCard className="mr-3 text-blue-600" /> Virtual ID Card
              </button>
              <button
                className="flex items-center px-4 py-3 w-full text-left hover:bg-red-100 text-red-600 transition-colors"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-4 border-t-transparent border-red-600 rounded-full animate-spin mr-3"></div>
                ) : (
                  <FaSignOutAlt className="mr-3" />
                )}
                {loading ? "Logging Out..." : "Log Out"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Close Button */}
      {menuOpen && (
        <button
          aria-label="Close Menu"
          className="lg:hidden absolute top-4 right-4"
          onClick={() => setMenuOpen(false)}
        >
          <FaTimes className="text-2xl text-white" />
        </button>
      )}
      {showProfileModal && (
        <UserProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
