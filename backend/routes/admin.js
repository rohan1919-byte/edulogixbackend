const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');

// Get all activities with user details
router.get('/activities', protect, adminOnly, async (req, res) => {
  try {
    console.log('Admin requesting activities. Admin ID:', req.user.id);
    
    const activities = await Activity.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${activities.length} activities`);
    
    // Map activities to ensure proper user data
    const mappedActivities = activities.map(activity => {
      const activityObj = activity.toObject();
      if (!activityObj.user) {
        activityObj.user = {
          name: 'Unknown User',
          email: 'No email'
        };
      }
      return activityObj;
    });

    res.json(mappedActivities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get all students
router.get('/students', protect, adminOnly, async (req, res) => {
  try {
    console.log('Admin requesting students list. Admin ID:', req.user.id);
    
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${students.length} students`);
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router; 