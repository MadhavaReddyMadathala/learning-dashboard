import express from 'express';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// @desc    Get all students and their course progress
// @route   GET /api/admin/students
// @access  Private/Admin
router.get('/students', protect, admin, async (req, res) => {
  try {
    // Fetch all student accounts
    const students = await User.find({ role: 'student' }).select('-password');

    // Map each student to their course enrollments and progress
    const studentsProgress = await Promise.all(
      students.map(async (student) => {
        const enrollments = await Enrollment.find({ userId: student._id })
          .populate('courseId', 'title duration lessons');

        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          enrollments: enrollments.map((enrollment) => ({
            enrollmentId: enrollment._id,
            courseId: enrollment.courseId ? enrollment.courseId._id : null,
            courseTitle: enrollment.courseId ? enrollment.courseId.title : 'Unknown Course',
            duration: enrollment.courseId ? enrollment.courseId.duration : 'N/A',
            progress: enrollment.progress,
            completedLessonsCount: enrollment.completedLessons.length,
            totalLessonsCount: enrollment.courseId ? enrollment.courseId.lessons.length : 0,
          })),
        };
      })
    );

    res.json(studentsProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
