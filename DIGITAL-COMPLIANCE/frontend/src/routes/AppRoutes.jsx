import { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

import AdminDashboard from "../pages/Dashboard/admin/AdminDashboard";
import ClassTeacherDashboard from "../pages/Dashboard/class-teacher/ClassTeacherDashboard";
import HODDashboard from "../pages/Dashboard/hod/HODDashboard";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";
import TeacherDashboard from "../pages/Dashboard/TeacherDashboard";

import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";

import PrivateRoute from "./PrivateRoute";

const NotFound = () => (
  <h1 className="text-center text-2xl font-bold">404 - Page Not Found</h1>
);

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  const navigate = useNavigate();

  const getDefaultDashboard = () => {
    const roleToDashboard = {
      admin: "/admin/dashboard",
      teacher: "/teacher/dashboard",
      classTeacher: "/class-teacher/dashboard",
      hod: "/hod/dashboard",
      student: "/student/dashboard",
    };
    return roleToDashboard[user?.role] || "/login";
  };

  useEffect(() => {
    if (user) {
      console.log(user);
      toast.success("Login successful!", { autoClose: 1000 });
      setTimeout(() => {
        navigate(getDefaultDashboard());
      }, 1000);
    }
  }, [user, navigate]);

  return (
    <>
      {user ? (
        <>
          <Navbar />
          <div className="flex">
            <Sidebar />
            <div className="w-full p-6">
              <Routes>
                <Route
                  path="/dashboards"
                  element={<Navigate to={getDefaultDashboard()} />}
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <PrivateRoute roles={["admin"]}>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/teacher/dashboard"
                  element={
                    <PrivateRoute roles={["teacher"]}>
                      <TeacherDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/class-teacher/dashboard"
                  element={
                    <PrivateRoute roles={["classTeacher"]}>
                      <ClassTeacherDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/hod/dashboard"
                  element={
                    <PrivateRoute roles={["hod"]}>
                      <HODDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/student/dashboard"
                  element={
                    <PrivateRoute roles={["student"]}>
                      <StudentDashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
      <Footer />
    </>
  );
};

export default AppRoutes;
