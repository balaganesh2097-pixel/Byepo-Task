import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("endUserToken");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("endUserToken"));
  const [mode, setMode] = useState<"login" | "signup">("login");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  
  const [featureKey, setFeatureKey] = useState("");
  const [statusResult, setStatusResult] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setError("");
    try {
      let res;
      if (mode === "login") {
        res = await axios.post(`${API_URL}/auth/login`, { email, password });
      } else {
        res = await axios.post(`${API_URL}/auth/user/signup`, { name, email, password, organizationId });
      }
      const t = res.data.data.accessToken;
      setToken(t);
      localStorage.setItem("endUserToken", t);
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  const handleCheckFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusResult(null);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/features/check/${featureKey}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatusResult(res.data.data.isEnabled);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to check feature");
    }
  };

  const handleLogout = () => {
    setToken(null);
    setStatusResult(null);
    setFeatureKey("");
    localStorage.removeItem("endUserToken");
  };

  if (!token) {
    return (
      <div className="container">
        <div className="card login-card">
          <h2>End User {mode === "login" ? "Login" : "Signup"}</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleAuth}>
            {mode === "signup" && (
              <>
                <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                <input type="text" placeholder="Organization ID" value={organizationId} onChange={e => setOrganizationId(e.target.value)} required />
              </>
            )}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            <button type="submit">{mode === "login" ? "Login" : "Signup"}</button>
          </form>
          <p style={{textAlign: "center", marginTop: "1rem"}}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
              {mode === "login" ? "Signup" : "Login"}
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h2>End User Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      
      <div className="card">
        <h3>Check Feature Access</h3>
        <p>Enter a feature key to see if it is enabled for your organization.</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleCheckFeature} className="inline-form">
          <input 
            type="text" 
            placeholder="Feature Key" 
            value={featureKey} 
            onChange={e => {
              setFeatureKey(e.target.value);
              setStatusResult(null);
              setError("");
            }} 
            required 
          />
          <button type="submit">Check</button>
        </form>

        {statusResult !== null && (
          statusResult ? (
            <div className="success-box">Feature is ENABLED</div>
          ) : (
            <div className="error-box">Feature is DISABLED</div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
