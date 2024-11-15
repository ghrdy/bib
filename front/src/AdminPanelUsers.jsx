import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPanelUsers.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', role: 'simple' });
  const [editingUserId, setEditingUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/status', { withCredentials: true });
      console.log('Status response:', response.data);
      if (!response.data.loggedIn || response.data.role !== 'admin') {
        navigate('/login');
      } else {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error checking admin status:', error.response ? error.response.data : error.message);
      navigate('/login');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        await axios.put(`http://localhost:5000/api/users/${editingUserId}`, form, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/users/add', form, { withCredentials: true });
      }
      setForm({ nom: '', prenom: '', email: '', password: '', role: 'simple' });
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (user) => {
    setForm({ nom: user.nom, prenom: user.prenom, email: user.email, password: '', role: user.role });
    setEditingUserId(user._id);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, { withCredentials: true });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <form onSubmit={handleSubmit} className="user-form">
        <input type="text" name="nom" value={form.nom} onChange={handleInputChange} placeholder="Nom" required />
        <input type="text" name="prenom" value={form.prenom} onChange={handleInputChange} placeholder="Prénom" required />
        <input type="email" name="email" value={form.email} onChange={handleInputChange} placeholder="Email" required />
        <input type="password" name="password" value={form.password} onChange={handleInputChange} placeholder="Password" required={!editingUserId} />
        <select name="role" value={form.role} onChange={handleInputChange}>
          <option value="admin">Admin</option>
          <option value="referent">Referent</option>
          <option value="simple">Simple</option>
        </select>
        <button type="submit">{editingUserId ? 'Update User' : 'Create User'}</button>
      </form>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;