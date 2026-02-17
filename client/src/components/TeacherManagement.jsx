import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import Toast from './Toast';
import '../styles/TeacherManagement.css';

function TeacherManagement({ user, onTeacherUpdate }) {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    department: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/teachers`);
      setTeachers(response.data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/api/teachers/${editingId}`,
          formData,
          {
            headers: {
              'x-user-id': user.id,
            },
          }
        );
        setToast({ message: 'Teacher updated successfully!', type: 'success' });
      } else {
        await axios.post(
          `${API_URL}/api/teachers`,
          formData,
          {
            headers: {
              'x-user-id': user.id,
            },
          }
        );
        setToast({ message: 'Teacher created successfully!', type: 'success' });
      }
      setFormData({ name: '', subject: '', department: '', email: '' });
      setShowForm(false);
      setEditingId(null);
      fetchTeachers();
      onTeacherUpdate();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Error saving teacher', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      department: teacher.department,
      email: teacher.email,
    });
    setEditingId(teacher._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await axios.delete(`${API_URL}/api/teachers/${id}`, {
        headers: {
          'x-user-id': user.id,
        },
      });
      setToast({ message: 'Teacher deleted successfully!', type: 'success' });
      fetchTeachers();
      onTeacherUpdate();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Error deleting teacher', type: 'error' });
    }
  };

  return (
    <div className="teacher-management">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="management-header">
        <button
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setFormData({ name: '', subject: '', department: '', email: '' });
              setEditingId(null);
            }
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add New Teacher'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Edit Teacher' : 'Add New Teacher'}</h3>
          <form onSubmit={handleSubmit} className="teacher-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Teacher's full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Mathematics"
                required
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Science"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="teacher@example.com"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </form>
        </div>
      )}

      <div className="teachers-grid">
        {teachers.length === 0 ? (
          <p className="empty-state">No teachers added yet</p>
        ) : (
          teachers.map(teacher => (
            <div key={teacher._id} className="teacher-card">
              <h3>{teacher.name}</h3>
              <p className="subject">{teacher.subject}</p>
              <p className="department">{teacher.department}</p>
              <p className="email">{teacher.email}</p>
              <div className="actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(teacher)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(teacher._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeacherManagement;
