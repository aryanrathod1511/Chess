import React, { useState } from "react";
import { useForm } from "react-hook-form";
import '../style/signup.css';

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = (data: any) => {
    setLoading(true);
    // Implement your signup logic here, e.g., calling an API to register
    console.log(data);
    setLoading(false);
  };

  // Handle Google signup (Placeholder for actual Google login)
  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
    // Implement your Google login logic here
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Sign Up</h2>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="form-control"
            type="text"
            placeholder="Name"
            {...register("name", { required: true })}
          />
          {errors.name && <span className="error">Name is required</span>}

          <input
            className="form-control"
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
          />
          {errors.email && <span className="error">Email is required</span>}

          <input
            className="form-control"
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password && <span className="error">Password is required</span>}

          <button className="signup-btn" type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        
      </div>

      {/* Google Signup Button */}
      <button className="google-signup-btn" onClick={handleGoogleSignup}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
          />
          Sign Up with Google
        </button>
      
    </div>

    
  );
};

export default Signup;
