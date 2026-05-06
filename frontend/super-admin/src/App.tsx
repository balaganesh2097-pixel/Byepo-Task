import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("superAdminToken");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

interface Org {
  id: string;
  name: string;
  createdAt: string;
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("superAdminToken"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [newOrgName, setNewOrgName] = useState("");
  const [error, setError] = useState("");

  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [editOrgName, setEditOrgName] = useState("");

  useEffect(() => {
    if (token) fetchOrgs();
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/auth/super-admin/login`, { email, password });
      const t = res.data.data.accessToken;
      setToken(t);
      localStorage.setItem("superAdminToken", t);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const fetchOrgs = async () => {
    try {
      const res = await axios.get(`${API_URL}/organizations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrgs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/organizations`, { name: newOrgName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewOrgName("");
      fetchOrgs();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create organization");
    }
  };

  const handleUpdateOrg = async (id: string) => {
    if (!editOrgName.trim()) return;
    try {
      await axios.patch(`${API_URL}/organizations/${id}`, { name: editOrgName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingOrgId(null);
      setEditOrgName("");
      fetchOrgs();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update organization");
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("superAdminToken");
  };

  if (!token) {
    return (
      <div className="container">
        <div className="card login-card">
          <h2>Super Admin Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h2>Super Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      
      <div className="card">
        <h3>Create Organization</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleCreateOrg} className="inline-form">
          <input type="text" placeholder="Organization Name" value={newOrgName} onChange={e => setNewOrgName(e.target.value)} required />
          <button type="submit">Create</button>
        </form>
      </div>

      <div className="card">
        <h3>Organizations</h3>
        {orgs.length === 0 ? <p>No organizations found.</p> : (
          <ul className="list">
            {orgs.map(org => (
              <li key={org.id}>
                {editingOrgId === org.id ? (
                  <div className="feature-row">
                    <div className="feature-key">
                      <input 
                        type="text" 
                        value={editOrgName} 
                        onChange={e => setEditOrgName(e.target.value)} 
                        autoFocus 
                        style={{ margin: 0, width: '100%' }}
                      />
                    </div>
                    <button className="edit-btn" onClick={() => handleUpdateOrg(org.id)}>Save</button>
                    <button className="edit-btn" onClick={() => setEditingOrgId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="feature-row">
                    <div className="feature-key">
                      <strong style={{ fontSize: '1.1rem' }}>{org.name}</strong>
                    </div>
                    <span className="code-id">ID: {org.id}</span>
                    <button className="edit-btn" onClick={() => {
                      setEditingOrgId(org.id);
                      setEditOrgName(org.name);
                    }}>Edit</button>
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
