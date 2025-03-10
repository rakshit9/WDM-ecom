import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/users.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  // ✅ Handle input changes for editing
  const handleChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  // ✅ Update user details
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/users/${editingUser._id}`, editingUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("User updated successfully");
      setShowEditForm(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  // ✅ Open edit form
  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  // ✅ Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${BASE_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="users-container">
      <h2>User Management</h2>

      {showEditForm && (
        <div className="edit-form-overlay">
          <div className="edit-form">
            <h3>Edit User</h3>
            <form onSubmit={handleUpdate}>
              <div>
                <label className="form-label">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={editingUser.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={editingUser.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={editingUser.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="update-btn">
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <Link
                    to={`/dashboard/${user.username}`}
                    className="user-link"
                  >
                    {user.username}
                  </Link>
                </td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
