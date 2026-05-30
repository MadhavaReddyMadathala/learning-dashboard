import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('Existing collections cleared.');

    console.log('Seeding users...');
    
    // Seed Demo Admin (User.create triggers the pre-save password-hashing hook)
    const adminUser = await User.create({
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log(`Admin user created: ${adminUser.email}`);

    // Seed Demo Student
    const studentUser = await User.create({
      name: 'Demo Student',
      email: 'student@demo.com',
      password: 'Student@123',
      role: 'student',
    });
    console.log(`Student user created: ${studentUser.email}`);

    console.log('Seeding courses...');
    const courses = [
      {
        title: 'Introduction to React & Modern UI',
        description: 'Learn the fundamentals of React.js including Virtual DOM, component states, hooks, and visual craftsmanship using Tailwind CSS utility styles.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop',
        duration: '6 Hours',
        lessons: [
          'Lesson 1: Introduction to React & JSX',
          'Lesson 2: Core Components & Props',
          'Lesson 3: State & React Lifecycle Hook: useState',
          'Lesson 4: Dynamic UI with Tailwind CSS Utilities',
          'Lesson 5: Handling Side Effects with useEffect',
          'Lesson 6: Asynchronous Actions & Fetching APIs',
        ],
      },
      {
        title: 'Mastering Node.js & REST API Design',
        description: 'Deep dive into server development, routing structures, database queries with Mongoose, and cookie-based JWT user authentication architectures.',
        thumbnail: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=600&auto=format&fit=crop',
        duration: '8 Hours',
        lessons: [
          'Lesson 1: Understanding Event Loop & Node Run-times',
          'Lesson 2: Initializing Express Servers & Core Middleware',
          'Lesson 3: Advanced MongoDB & Mongoose Schema Design',
          'Lesson 4: REST API Routing & Controller Architecture',
          'Lesson 5: JSON Web Tokens & Secure Cookies Config',
          'Lesson 6: Error Handling & Middleware Pipeline',
        ],
      },
    ];

    const seededCourses = await Course.insertMany(courses);
    console.log('Courses seeded successfully!');

    // Automatically enroll the demo student in the first course to show dashboard state out-of-the-box
    console.log('Enrolling demo student in the first course...');
    await Enrollment.create({
      userId: studentUser._id,
      courseId: seededCourses[0]._id,
      progress: 33, // preset some completion progress
      completedLessons: [
        'Lesson 1: Introduction to React & JSX',
        'Lesson 2: Core Components & Props',
      ],
    });
    console.log('Student enrollment initialized.');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
