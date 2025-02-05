import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the auth token from local storage
    localStorage.removeItem("authToken");

    // Navigate to the home page
    navigate("/");
  }, [navigate]);

  return null;
};

export default Logout;
