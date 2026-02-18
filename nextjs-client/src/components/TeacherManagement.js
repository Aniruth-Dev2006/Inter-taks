'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function TeacherManagement({ onTeacherUpdate }) {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    department: '',
    email: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const response = await api.get('/api/teachers');
      setSpecialists(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching specialists:', err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/teachers/${editingId}`, formData);
      } else {
        await api.post('/api/teachers', formData);
      }
      setFormData({ name: '', subject: '', department: '', email: '' });
      setEditingId(null);
      fetchSpecialists();
      if (onTeacherUpdate) onTeacherUpdate();
    } catch (err) {
      console.error('Error saving specialist:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this specialist?')) return;
    
    try {
      await api.delete(`/api/teachers/${id}`);
      fetchSpecialists();
      if (onTeacherUpdate) onTeacherUpdate();
    } catch (err) {
      console.error('Error deleting specialist:', err);
    }
  };

  const handleEdit = (specialist) => {
    setFormData({
      name: specialist.name,
      subject: specialist.subject,
      department: specialist.department || '',
      email: specialist.email,
    });
    setEditingId(specialist._id);
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>
        {editingId ? 'Edit Specialist' : 'Add Specialist'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Specialist name"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
              Subject/Domain
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              placeholder="e.g., Mathematics, Physics"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
              placeholder="e.g., Science, Engineering"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="email@example.com"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Specialist' : 'Add Specialist'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => {
                setFormData({ name: '', subject: '', department: '', email: '' });
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div className="spinner"></div>
        </div>
      ) : specialists.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: 'var(--spacing-xl)' }}>
          No specialists yet. Add one above!
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {specialists.map((specialist) => (
            <div key={specialist._id} className="card" style={{ background: 'var(--gray-50)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{specialist.name}</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                <strong>Subject:</strong> {specialist.subject}
              </p>
              <p style={{ color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                <strong>Department:</strong> {specialist.department}
              </p>
              <p style={{ color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-md)' }}>
                <strong>Email:</strong> {specialist.email}
              </p>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button onClick={() => handleEdit(specialist)} className="btn btn-secondary btn-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(specialist._id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
