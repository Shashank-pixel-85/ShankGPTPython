import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import bg from "../assets/auth-bg.jpg";
import { assets } from "../assets/assets";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <div
  className="auth-container"
  style={{ backgroundImage: `url(${bg})` }}
>
  <div className="auth-brand">SHANKGPT</div>
      <form className="auth-box" onSubmit={handleLogin}>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-sub">Login to continue</p>

        {error && <div className="auth-error">{error}</div>}

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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="auth-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;