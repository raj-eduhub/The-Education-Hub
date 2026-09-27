import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleOff,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { readJson } from "./auth.js";

const emptyForm = { name: "", email: "", role: "student" };

function when(value) {
  if (!value) return "Not updated yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not updated yet";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminDashboard({ request }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) =>
      [user.name, user.email, user.role, user.status].some((value) =>
        value?.toLowerCase().includes(term)
      )
    );
  }, [query, users]);

  const activeCount = users.filter((user) => user.status === "active").length;

  async function loadUsers() {
    setStatus("loading");
    setMessage("");
    let response;
    try {
      response = await request("/api/users");
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("The user-management API is not connected in this local session.");
      }
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "Unable to load users.");
      setUsers(data.users);
      setStatus("ready");
    } catch (error) {
      setMessage(error.message);
      setStatus(
        response?.status === 401 ||
          response?.status === 403 ||
          error.message.toLowerCase().includes("administrator")
          ? "forbidden"
          : "error"
      );
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function addUser(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await request("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "Unable to add the user.");
      setUsers((items) => [data.user, ...items.filter((item) => item.id !== data.user.id)]);
      setForm(emptyForm);
      setMessage(`${data.user.email} can now access Education Hub.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleUser(user) {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    setMessage("");
    try {
      const response = await request(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "Unable to update the user.");
      setUsers((items) => items.map((item) => (item.id === user.id ? data.user : item)));
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function removeUser(user) {
    if (!window.confirm(`Remove ${user.email} from Education Hub?`)) return;
    setMessage("");
    try {
      const response = await request(`/api/users/${user.id}`, { method: "DELETE" });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "Unable to remove the user.");
      setUsers((items) => items.filter((item) => item.id !== user.id));
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (status === "forbidden") {
    return (
      <section className="access-state">
        <ShieldCheck size={32} />
        <h2>Administrator access required</h2>
        <p>{message}</p>
        <p>Sign in with an administrator Google account and try again.</p>
      </section>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Access control</p>
          <h2>User management</h2>
          <p>Control who can sign in and use Sonia, the AI tutor.</p>
        </div>
        <button className="icon-button" onClick={loadUsers} title="Refresh users" type="button">
          <RefreshCw size={18} />
        </button>
      </header>

      <section className="admin-stats" aria-label="User totals">
        <div><Users size={20} /><span>All users</span><strong>{users.length}</strong></div>
        <div><CheckCircle2 size={20} /><span>Active</span><strong>{activeCount}</strong></div>
        <div><CircleOff size={20} /><span>Inactive</span><strong>{users.length - activeCount}</strong></div>
      </section>

      <section className="admin-layout">
        <form className="add-user-panel" onSubmit={addUser}>
          <div className="section-title"><UserPlus size={20} /><h3>Add a user</h3></div>
          <label>
            Full name
            <input
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
              value={form.name}
            />
          </label>
          <label>
            Email address
            <input
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              type="email"
              value={form.email}
            />
          </label>
          <label>
            Access type
            <select
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              value={form.role}
            >
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
            </select>
          </label>
          <button className="primary-button" disabled={saving} type="submit">
            <UserPlus size={18} />
            {saving ? "Adding..." : "Add user"}
          </button>
        </form>

        <section className="user-list-panel">
          <div className="user-list-toolbar">
            <div>
              <h3>Application users</h3>
              <p>{filteredUsers.length} shown</p>
            </div>
            <label className="search-box">
              <Search size={17} />
              <input
                aria-label="Search users"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name or email"
                value={query}
              />
            </label>
          </div>

          {status === "ready" && message && <p className="admin-message" role="status">{message}</p>}
          {status === "loading" && <p className="empty-users">Loading users...</p>}
          {status === "error" && <p className="empty-users">{message}</p>}
          {status === "ready" && filteredUsers.length === 0 && (
            <p className="empty-users">No users match this view.</p>
          )}

          {filteredUsers.length > 0 && (
            <div className="user-table-wrap">
              <table className="user-table">
                <thead><tr><th>User</th><th>Type</th><th>Status</th><th>Last updated</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td><div className="user-identity"><strong>{user.name}</strong><span>{user.email}</span></div></td>
                      <td><span className="role-label">{user.role}</span></td>
                      <td><span className={`status-label ${user.status}`}>{user.status}</span></td>
                      <td><span className="user-updated-at">{when(user.updatedAt)}</span></td>
                      <td><div className="row-actions">
                          <button onClick={() => toggleUser(user)} title={user.status === "active" ? "Deactivate user" : "Activate user"} type="button">
                            {user.status === "active" ? <CircleOff size={17} /> : <CheckCircle2 size={17} />}
                          </button>
                          <button className="danger" onClick={() => removeUser(user)} title="Remove user" type="button"><Trash2 size={17} /></button>
                        </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
