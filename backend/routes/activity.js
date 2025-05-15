const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

// Create a new activity
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, completionDate, certificateUrl } = req.body;
    
    const activity = new Activity({
      title,
      description,
      completionDate,
      certificateUrl,
      student: req.user.id
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all activities for the logged-in student
router.get('/', protect, async (req, res) => {
  try {
    const activities = await Activity.find({ student: req.user.id })
      .sort({ completionDate: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update an activity
router.put('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Make sure user owns activity
    if (activity.student.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedActivity);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete an activity
router.delete('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Make sure user owns activity
    if (activity.student.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await activity.remove();
    res.json({ message: 'Activity removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 