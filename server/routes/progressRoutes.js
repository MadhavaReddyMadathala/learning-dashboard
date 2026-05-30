import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get progress for a course
// @route   GET /api/progress/:courseId
// @access  Private (Student)
router.get('/:courseId', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    }).populate('courseId');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found for this course' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update progress for a course (toggle lesson completion status)
// @route   PUT /api/progress/:courseId
// @access  Private (Student)
router.put('/:courseId', protect, async (req, res) => {
  try {
    const { lessonTitle } = req.body;

    if (!lessonTitle) {
      return res.status(400).json({ message: 'Please specify lessonTitle' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify the lesson exists in the course
    if (!course.lessons.includes(lessonTitle)) {
      return res.status(400).json({ message: 'Lesson does not belong to this course' });
    }

    let enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Toggle logic
    const lessonIndex = enrollment.completedLessons.indexOf(lessonTitle);
    if (lessonIndex > -1) {
      enrollment.completedLessons.splice(lessonIndex, 1);
    } else {
      enrollment.completedLessons.push(lessonTitle);
    }

    // Calculate progress
    const totalLessons = course.lessons.length;
    enrollment.progress = totalLessons > 0 
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
