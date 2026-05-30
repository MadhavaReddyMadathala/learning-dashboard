import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Enroll in a course
// @route   POST /api/enroll/:courseId
// @access  Private (Student)
router.post('/:courseId', protect, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    // Check if the user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify user is not already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      userId,
      courseId,
      progress: 0,
      completedLessons: [],
    });

    const createdEnrollment = await enrollment.save();
    res.status(201).json(createdEnrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
