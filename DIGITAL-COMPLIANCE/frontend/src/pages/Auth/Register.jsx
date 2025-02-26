import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    branch: "",
    semester: "",
    year: "",
    division: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add role to form data before submitting (default role is "student")
    const registrationData = {
      ...formData,
      role: "student", // Hardcoding role as "student"
    };

    try {
      const response = await axios.post("/auth/register", registrationData);
      toast.success(response.data.message);

      setTimeout(() => navigate("/login"), 1000); // Wait 1 second and navigate to login
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Full Name"
            required
          />
        </div>

        <div className="mb-4">
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

        <div className="mb-4">
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

        <div className="mb-4">
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Roll Number (e.g., SECOD51)"
            required
          />
          <small className="text-gray-500">Format: SECOD51</small>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="" disabled>
              Select Branch
            </option>
            <option value="Computer">Computer</option>
            <option value="Electrical">Electrical</option>
            <option value="Electronics and Telecommunication">
              Electronics and Telecommunication
            </option>
            <option value="Information Technology">
              Information Technology
            </option>
            <option value="AI and ML">AI and ML</option>
          </select>

          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="" disabled>
              Select Semester
            </option>
            {[...Array(8).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                Semester {num + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="" disabled>
              Select Year
            </option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <select
            name="division"
            value={formData.division}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="" disabled>
              Select Division
            </option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Register
        </button>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
