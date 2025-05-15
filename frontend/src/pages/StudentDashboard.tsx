import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';

interface Activity {
  _id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  type: string;
  user: string;
  createdAt: string;
  image?: string;
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: '',
    type: 'academic'
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/activities/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setActivities(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch activities');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key as keyof typeof formData]);
      });
      
      // Append image if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      await axios.post(
        'http://localhost:5000/api/activities',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setFormData({
        title: '',
        description: '',
        date: '',
        duration: '',
        type: 'academic'
      });
      setSelectedImage(null);
      setShowForm(false);
      fetchActivities();
    } catch (err) {
      setError('Failed to add activity');
    }
  };

  const handleDelete = async (activityId: string) => {
    try {
      setDeleteLoading(activityId);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/activities/${activityId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setActivities(activities.filter(activity => activity._id !== activityId));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete activity');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Activities</h1>
                  <p className="mt-1 text-gray-500">Track and manage your academic journey</p>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                >
                  {showForm ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Close Form
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Activity
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-1">
  Duration (months)
</label>
<input
  type="number"
  name="duration"
  value={formData.duration}
  onChange={handleInputChange}
  className="w-full p-2 border rounded"
  required
  min={1}
/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="academic">Academic</option>
                        <option value="extracurricular">Extracurricular</option>

                        <option value="awards">Awards</option> 
                        <option value="activity">Activity</option>

                        <option value="sports">Sports</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded"
                      />
                      {selectedImage && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Submit Activity
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                  <div
                    key={activity._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-102 transition duration-300 border border-gray-200 hover:shadow-xl"
                  >
                    {activity.image && (
                      <div className="relative h-48 w-full">
                        <img
                          src={`http://localhost:5000${activity.image}`}
                          alt={activity.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
  activity.type === 'academic' ? 'bg-blue-100 text-blue-800' :
  activity.type === 'extracurricular' ? 'bg-green-100 text-green-800' :
  activity.type === 'awards' ? 'bg-red-100 text-red-800' :
  activity.type === 'activity' ? 'bg-pink-100 text-pink-800' :
  activity.type === 'sports' ? 'bg-purple-100 text-purple-800' :
  'bg-gray-100 text-gray-800'
}`}>
  {activity.type}
</span>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this activity?')) {
                              handleDelete(activity._id);
                            }
                          }}
                          disabled={deleteLoading === activity._id}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          {deleteLoading === activity._id ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                      <p className="text-gray-600 mb-4">{activity.description}</p>
                      <div className="text-sm text-gray-500 space-y-2">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p>{new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <p>{activity.duration} Months</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <ChatBot />
      <Footer />
    </div>
  );
};

export default StudentDashboard; 