import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { customerVerified } from "../../services/userservices";

const VerifyEmailMessage = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      customerVerified(token)
        .then((res) => {
          toast.success(res.data.message);
          navigate("/login"); 
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Verification failed");
        });
    }
  }, [token, navigate]);

  return <div>Verifying email, please wait...</div>;
};

export default VerifyEmailMessage;
