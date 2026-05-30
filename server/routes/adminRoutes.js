import express from 'express';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import { protect } from '../middleware/authMiddleware.js';
import {admin} from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/students', protect, admin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    const result = await Promise.all(
      students.map(async (student) => {
        const enrollments = await Enrollment.find({ userId: student._id }).populate('courseId');
        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          enrollments: enrollments.map((e) => ({
            enrollmentId: e._id,
            courseTitle: e.courseId?.title || 'Unknown Course',
            progress: e.progress || 0,
            completedLessonsCount: e.completedLessons?.length || 0,
            totalLessonsCount: e.courseId?.lessons?.length || 0,
            duration: e.courseId?.duration || 'N/A',
          })),
        };
      })
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
