import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api"; // Replace with your Axios instance
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { login } = useContext(AuthContext); // Access login function
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState(""); // State to store selected role (teacher/student)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select a role!");
      return;
    }

    try {
      const response = await api.post("/auth/login", { ...formData, role }); // Send role with form data
      const { token, ...userData } = response.data;
      console.log("response", response);

      localStorage.setItem("token", token); // Save token in localStorage
      login(userData); // Update user context
      console.log("login", login);
      console.log("userData", userData);
      toast.success("Login successful!");
      navigate("/dashboards"); // Redirect to dashboards
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        {/* Role Selection */}
        <div className="mb-4 text-center">
          <button
            type="button"
            className={`px-4 py-2 m-2 rounded ${
              role === "student" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleRoleSelect("student")}
          >
            Login as Student
          </button>
          <button
            type="button"
            className={`px-4 py-2 m-2 rounded ${
              role === "teacher" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleRoleSelect("teacher")}
          >
            Login as Teacher
          </button>
        </div>

        {/* Email and Password Inputs */}
        <div className="flex flex-col mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Email Address"
            required
          />
        </div>

        <div className="flex flex-col mb-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
