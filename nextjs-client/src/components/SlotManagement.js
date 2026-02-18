'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function SlotManagement({ onSlotUpdate }) {
  const [slots, setSlots] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    teacherId: '',
    teacherName: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    capacity: 10,
    price: 500,
    description: '',
  });

  useEffect(() => {
    fetchSlots();
    fetchSpecialists();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await api.get('/api/slots');
      setSlots(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setLoading(false);
    }
  };

  const fetchSpecialists = async () => {
    try {
      const response = await api.get('/api/teachers');
      setSpecialists(response.data);
    } catch (err) {
      console.error('Error fetching specialists:', err);
    }
  };

  const handleSpecialistChange = (e) => {
    const selectedSpecialist = specialists.find(t => t._id === e.target.value);
    if (selectedSpecialist) {
      setFormData({
        ...formData,
        teacherId: selectedSpecialist._id,
        teacherName: selectedSpecialist.name,
        subject: selectedSpecialist.subject,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map teacherId to teacher for the API
      const submitData = {
        ...formData,
        teacher: formData.teacherId,
      };
      delete submitData.teacherId;
      
      await api.post('/api/slots', submitData);
      setFormData({
        teacherId: '',
        teacherName: '',
        subject: '',
        date: '',
        startTime: '',
        endTime: '',
        capacity: 10,
        price: 500,
        description: '',
      });
      fetchSlots();
      if (onSlotUpdate) onSlotUpdate();
    } catch (err) {
      console.error('Error creating slot:', err);
      alert(err.response?.data?.message || 'Error creating slot');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    
    try {
      await api.delete(`/api/slots/${id}`);
      fetchSlots();
      if (onSlotUpdate) onSlotUpdate();
    } catch (err) {
      console.error('Error deleting slot:', err);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Create New Slot</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
              Specialist
            </label>
            <select
              value={formData.teacherId}
              onChange={handleSpecialistChange}
              required
            >
              <option value="">Select Specialist</option>
              {specialists.map((specialist) => (
                <option key={specialist._id} value={specialist._id}>
                  {specialist.name} - {specialist.subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
              End Time
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
              Capacity
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              required
              min="1"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
              Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              required
              min="0"
            />
          </div>
        </div>
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            placeholder="Add any notes or description for this slot..."
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Slot
        </button>
      </form>

      <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>All Slots</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div className="spinner"></div>
        </div>
      ) : slots.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: 'var(--spacing-xl)' }}>
          No slots created yet. Create one above!
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {slots.map((slot) => (
            <div key={slot._id} className="card" style={{ background: 'var(--gray-50)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-md)' }}>
                <h3 style={{ margin: 0 }}>{slot.teacherName}</h3>
                <span className="badge badge-info">{slot.subject}</span>
              </div>
              <div style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)' }}>
                <p style={{ marginBottom: 'var(--spacing-xs)' }}><strong>Date:</strong> {slot.date}</p>
                <p style={{ marginBottom: 'var(--spacing-xs)' }}><strong>Time:</strong> {slot.startTime} - {slot.endTime}</p>
                <p style={{ marginBottom: 'var(--spacing-xs)' }}>
                  <strong>Capacity:</strong> {slot.availableSeats}/{slot.capacity} available
                </p>
                <p style={{ marginBottom: 'var(--spacing-xs)' }}><strong>Price:</strong> ₹{slot.price}</p>
                {slot.description && (
                  <p style={{ marginTop: 'var(--spacing-sm)', fontStyle: 'italic' }}>{slot.description}</p>
                )}
              </div>
              <button onClick={() => handleDelete(slot._id)} className="btn btn-danger btn-sm" style={{ width: '100%' }}>
                Delete Slot
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
