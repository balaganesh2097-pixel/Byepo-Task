import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("orgAdminToken");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

interface FeatureFlag {
  id: string;
  key: string;
  isEnabled: boolean;
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("orgAdminToken"));
  const [mode, setMode] = useState<"login" | "signup">("login");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [newFeatureKey, setNewFeatureKey] = useState("");
  const [error, setError] = useState("");

  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [editFeatureKey, setEditFeatureKey] = useState("");

  useEffect(() => {
    if (token) fetchFeatures();
  }, [token]);

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
        res = await axios.post(`${API_URL}/auth/admin/signup`, { name, email, password, organizationId });
      }
      const t = res.data.data.accessToken;
      setToken(t);
      localStorage.setItem("orgAdminToken", t);
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  const fetchFeatures = async () => {
    try {
      const res = await axios.get(`${API_URL}/features`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeatures(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/features`, { key: newFeatureKey }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewFeatureKey("");
      fetchFeatures();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create feature");
    }
  };

  const handleToggle = async (id: string, isEnabled: boolean) => {
    try {
      await axios.patch(`${API_URL}/features/${id}`, { isEnabled }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFeatures();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateKey = async (id: string) => {
    if (!editFeatureKey.trim()) return;
    try {
      await axios.patch(`${API_URL}/features/${id}`, { key: editFeatureKey }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingFeatureId(null);
      setEditFeatureKey("");
      fetchFeatures();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update feature key");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/features/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFeatures();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("orgAdminToken");
  };

  if (!token) {
    return (
      <div className="container">
        <div className="card login-card">
          <h2>Organization Admin {mode === "login" ? "Login" : "Signup"}</h2>
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
        <h2>Org Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      
      <div className="card">
        <h3>Create Feature Flag</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleCreateFeature} className="inline-form">
          <input type="text" placeholder="Feature Key (e.g. beta_feature)" value={newFeatureKey} onChange={e => setNewFeatureKey(e.target.value)} required />
          <button type="submit">Create</button>
        </form>
      </div>

      <div className="card">
        <h3>Feature Flags</h3>
        {features.length === 0 ? <p>No feature flags found.</p> : (
          <ul className="list">
            {features.map(feature => (
              <li key={feature.id}>
                {editingFeatureId === feature.id ? (
                  <div className="feature-row">
                    <div className="feature-key">
                      <input 
                        type="text" 
                        value={editFeatureKey} 
                        onChange={e => setEditFeatureKey(e.target.value)} 
                        autoFocus 
                        style={{ margin: 0, width: '100%' }}
                      />
                    </div>
                    <button className="edit-btn" onClick={() => handleUpdateKey(feature.id)}>Save</button>
                    <button className="edit-btn" onClick={() => setEditingFeatureId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="feature-row">
                    <div className="feature-key">
                      <strong style={{ fontSize: '1.1rem' }}>{feature.key}</strong>
                    </div>
                    
                    <button className="edit-btn" onClick={() => {
                      setEditingFeatureId(feature.id);
                      setEditFeatureKey(feature.key);
                    }}>Edit Name</button>

                    <label className="checkbox-label" style={{ minWidth: '100px' }}>
                      <input 
                        type="checkbox" 
                        checked={feature.isEnabled} 
                        onChange={(e) => handleToggle(feature.id, e.target.checked)}
                      />
                      Enabled
                    </label>

                    <button className="logout-btn" onClick={() => handleDelete(feature.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
