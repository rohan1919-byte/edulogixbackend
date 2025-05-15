const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Get all activities for the logged-in user
router.get('/user', protect, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new activity with image upload
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    console.log('Received activity creation request:', req.body);
    const { title, description, date, duration, type } = req.body;

    // Validate required fields
    if (!title || !description || !date || !duration || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const activity = new Activity({
      title,
      description,
      date,
      duration: Number(duration),
      type,
      user: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    console.log('Creating activity:', activity);
    const savedActivity = await activity.save();
    console.log('Activity saved successfully:', savedActivity);
    res.status(201).json(savedActivity);
  } catch (err) {
    console.error('Error creating activity:', err);
    if (req.file) {
      // Clean up uploaded file if there was an error
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
      });
    }
    res.status(500).json({ message: 'Error creating activity: ' + err.message });
  }
});

// Update an activity
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const activity = await Activity.findOne({ _id: req.params.id, user: req.user.id });
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const { title, description, date, duration, type } = req.body;
    activity.title = title;
    activity.description = description;
    activity.date = date;
    activity.duration = Number(duration);
    activity.type = type;
    if (req.file) {
      // Delete old image if it exists
      if (activity.image) {
        const oldImagePath = path.join(__dirname, '..', activity.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      activity.image = `/uploads/${req.file.filename}`;
    }

    await activity.save();
    res.json(activity);
  } catch (err) {
    console.error('Error updating activity:', err);
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
      });
    }
    res.status(400).json({ message: err.message });
  }
});

// Delete an activity
router.delete('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check if the activity belongs to the logged-in user
    if (activity.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this activity' });
    }

    // Delete associated image if it exists
    if (activity.image) {
      const imagePath = path.join(__dirname, '..', activity.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await activity.deleteOne();
    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    console.error('Error deleting activity:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 