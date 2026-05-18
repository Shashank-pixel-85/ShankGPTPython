// src/pages/Signup.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import authBg from "../assets/auth-bg.jpg";
import { assets } from "../assets/assets";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(name, email, password);
      navigate("/");
    } catch (err) {
      setError("Signup failed. Try another email.");
    }

    setLoading(false);
  };

  return (
    <div
  className="auth-container"
  style={{ backgroundImage: `url(${authBg})` }}
>
  <div className="auth-brand">SHANKGPT</div>
      <form className="auth-box" onSubmit={handleSignup}>
                <h2 className="auth-title">Create an Account</h2>
       <p className="auth-sub">
  Join <span className="brand-highlight">ShankGPT</span> today!
</p>

        {error && <div className="auth-error">{error}</div>}

        <input
          type="text"
          className="auth-input"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="auth-btn" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;