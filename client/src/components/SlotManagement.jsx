import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import Toast from './Toast';
import '../styles/SlotManagement.css';

function SlotManagement({ user, onSlotUpdate }) {
  const [slots, setSlots] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    teacher: '',
    teacherName: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    capacity: 1,
    price: 50,
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSlots();
    fetchTeachers();
    
    // Auto-refresh every 5 seconds to keep data synchronized
    const interval = setInterval(() => {
      fetchSlots();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/slots`);
      setSlots(response.data);
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
  };

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

  const handleTeacherChange = (e) => {
    const selectedTeacherId = e.target.value;
    const selectedTeacher = teachers.find(t => t._id === selectedTeacherId);
    setFormData(prev => ({
      ...prev,
      teacher: selectedTeacherId,
      teacherName: selectedTeacher?.name || '',
      subject: selectedTeacher?.subject || '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/api/slots/${editingId}`,
          formData,
          {
            headers: {
              'x-user-id': user.id,
            },
          }
        );
        setToast({ message: 'Slot updated successfully!', type: 'success' });
      } else {
        await axios.post(
          `${API_URL}/api/slots`,
          formData,
          {
            headers: {
              'x-user-id': user.id,
            },
          }
        );
        setToast({ message: 'Slot created successfully!', type: 'success' });
      }
      resetForm();
      fetchSlots();
      onSlotUpdate();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Error saving slot', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      teacher: '',
      teacherName: '',
      subject: '',
      date: '',
      startTime: '',
      endTime: '',
      capacity: 1,
      price: 50,
      description: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (slot) => {
    setFormData({
      teacher: slot.teacher._id,
      teacherName: slot.teacherName,
      subject: slot.subject,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity,
      price: slot.price || 50,
      description: slot.description,
    });
    setEditingId(slot._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;

    try {
      await axios.delete(`${API_URL}/api/slots/${id}`, {
        headers: {
          'x-user-id': user.id,
        },
      });
      setToast({ message: 'Slot deleted successfully!', type: 'success' });
      fetchSlots();
      onSlotUpdate();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Error deleting slot', type: 'error' });
    }
  };

  return (
    <div className="slot-management">
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
            if (showForm) resetForm();
          }}
        >
          {showForm ? '✕ Cancel' : '+ Create New Slot'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Edit Slot' : 'Create New Slot'}</h3>
          <form onSubmit={handleSubmit} className="slot-form">
            <div className="form-group">
              <label>Select Teacher</label>
              <select
                name="teacher"
                value={formData.teacher}
                onChange={handleTeacherChange}
                required
              >
                <option value="">Choose a teacher...</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name} - {teacher.subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Capacity (Number of Students)</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Course Fee (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter course fee in rupees"
                required
              />
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any additional details..."
                rows="3"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Slot' : 'Create Slot'}
            </button>
          </form>
        </div>
      )}

      <div className="slots-container">
        {slots.length === 0 ? (
          <p className="empty-state">No slots created yet</p>
        ) : (
          <div className="slots-list">
            {slots.map(slot => (
              <div key={slot._id} className="slot-item">
                <div className="slot-info">
                  <h3>{slot.teacherName}</h3>
                  <p className="subject">{slot.subject}</p>
                  <div className="slot-details">
                    <span>📅 {slot.date}</span>
                    <span>⏰ {slot.startTime} - {slot.endTime}</span>
                    <span>👥 {slot.bookedBy.length}/{slot.capacity}</span>
                    <span>💵 ₹{slot.price || 50}</span>
                  </div>
                  {slot.description && (
                    <p className="description">{slot.description}</p>
                  )}
                </div>
                <div className="slot-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(slot)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(slot._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SlotManagement;
