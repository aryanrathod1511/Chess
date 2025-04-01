import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import '../style/login.css';
import googleImg from '../assets/googleImg.jpg';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = (data: any) => {
    setLoading(true);
    console.log(data);
    setLoading(false);
  };

  // Handle Google login (Placeholder for actual Google login)
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Implement your Google login logic here
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h4 className="login-title">Log in to your account</h4>

        <button onClick={handleGoogleLogin} className="google-login-btn">
          <i className="fab fa-google"></i>
          <img src={googleImg} alt="Google logo" className="google-logo" />
          Log in with Google
        </button>

        <p className="divider-text">OR</p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                  message: "Invalid email format",
                },
              })}
              id="email"
              className="form-control"
              placeholder="Email address"
              type="email"
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              {...register("password", { required: "Password is required" })}
              id="password"
              className="form-control"
              placeholder="Enter your password"
              type="password"
            />
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>

          <div className="form-group">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>
          </div>

          <p className="text-center">
            <p>Don't have an account? <Link to="/signup"> Sign up</Link></p>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
