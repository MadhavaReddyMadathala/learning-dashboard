import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a course description'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Please add a thumbnail URL'],
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    },
    duration: {
      type: String,
      required: [true, 'Please add a course duration'],
    },
    lessons: {
      type: [String],
      required: [true, 'Please add a list of lessons'],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
