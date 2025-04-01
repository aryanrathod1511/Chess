// src/components/auth/Signup.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/signup.css";
import googleImg from "../../assets/googleImg.jpg";

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { handleSignup, loading } = useAuth(); // Custom hook to handle signup logic

  // Form submission logic
  const onSubmit = (data: { name: string; email: string; password: string }) => {
    handleSignup(data);
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h4 className="signup-title">Create your account</h4>

        <button onClick={() => console.log("Google signup clicked")} className="google-signup-btn">
          <i className="fab fa-google"></i>
          <img src={googleImg} alt="Google logo" className="google-logo" />
          Sign up with Google
        </button>

        <p className="divider-text">OR</p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              {...register("name", { required: "Full name is required" })}
              id="name"
              className="form-control"
              placeholder="Full name"
              type="text"
            />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>

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
              placeholder="Create password"
              type="password"
            />
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>

          <div className="form-group">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <p className="text-center">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
