import { Link } from "react-router-dom";

const CheckEmailMessage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Check Your Email</h2>
      <p>
        We’ve sent you a verification link. Please check your inbox and click
        the link to verify your email.
      </p>
      <p>If you don’t see the email, check your spam folder.</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
};

export default CheckEmailMessage;
