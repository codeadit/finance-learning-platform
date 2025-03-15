import Swal from "sweetalert2";

export const handleError = (error, navigate, errorMessage = "Error fetching data: ") => {
  if (error.response && error.response.status === 401) {
    Swal.fire({
      icon: "warning",
      title: "Login Expired",
      text: "Your login session has expired. Please log in again.",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/login");
    });
  } else {
    console.error(errorMessage, error);
  }
};
