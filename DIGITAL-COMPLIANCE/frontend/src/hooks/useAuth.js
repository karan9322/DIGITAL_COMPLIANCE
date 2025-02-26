import { useContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode"; // You might need to install jwt-decode library
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      setUser({
        ...decodedToken,
        role: userRole,
      });
    }

    setLoading(false);
  }, []);

  return { user, loading };
};

export default useAuth;
