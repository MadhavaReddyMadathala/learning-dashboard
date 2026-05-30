import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  Users,
  ListPlus,
  X,
  Sparkles,
  Check
} from 'lucide-react';

// ✅ FIXED: strict API (no silent fallback)
const API = import.meta.env.VITE_API_URL;

if (!API) {
  throw new Error("VITE_API_URL is not defined in environment variables");
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [duration, setDuration] = useState('');
  const [lessons, setLessons] = useState([]);
  const [newLessonInput, setNewLessonInput] = useState('');

  // ---------------- FETCH DATA ----------------
  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [coursesRes, studentsRes] = await Promise.all([
        axios.get(`${API}/courses`),
        axios.get(`${API}/admin/students`)
      ]);

      setCourses(coursesRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const clearAlerts = () => {
    setError(null);
    setSuccess(null);
  };

  // ---------------- MODAL ----------------
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentCourseId(null);
    setTitle('');
    setDescription('');
    setThumbnail('');
    setDuration('');
    setLessons([]);
    setNewLessonInput('');
    setShowCourseModal(true);
  };

  const handleOpenEditModal = (course) => {
    setIsEditing(true);
    setCurrentCourseId(course._id);
    setTitle(course.title);
    setDescription(course.description);
    setThumbnail(course.thumbnail);
    setDuration(course.duration);
    setLessons(course.lessons || []);
    setNewLessonInput('');
    setShowCourseModal(true);
  };

  const handleAddLesson = () => {
    if (!newLessonInput.trim()) return;
    setLessons([...lessons, newLessonInput.trim()]);
    setNewLessonInput('');
  };

  const handleRemoveLesson = (idx) => {
    setLessons(lessons.filter((_, i) => i !== idx));
  };

  // ---------------- SAVE COURSE ----------------
  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!title || !description || !duration) {
      setError('Title, description, and duration are required');
      return;
    }

    const payload = {
      title,
      description,
      thumbnail,
      duration,
      lessons
    };

    try {
      if (isEditing) {
        await axios.put(`${API}/courses/${currentCourseId}`, payload);
        setSuccess('Course updated successfully');
      } else {
        await axios.post(`${API}/courses`, payload);
        setSuccess('Course created successfully');
      }

      setShowCourseModal(false);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course');
    }
  };

  // ---------------- DELETE COURSE ----------------
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course?')) return;

    try {
      await axios.delete(`${API}/courses/${courseId}`);
      setSuccess('Course deleted');
      fetchAdminData();
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  // ---------------- UI ----------------
  if (loading && courses.length === 0) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles /> Admin Panel
          </h1>
          <p className="text-gray-400">Manage courses & students</p>
        </div>

        {activeTab === 'courses' && (
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} /> Add Course
          </button>
        )}
      </div>

      {/* ALERTS */}
      {success && <div className="text-green-400 mb-4">{success}</div>}
      {error && <div className="text-red-400 mb-4">{error}</div>}

      {/* TABS */}
      <div className="flex gap-6 mb-6">
        <button onClick={() => setActiveTab('courses')}>Courses</button>
        <button onClick={() => setActiveTab('students')}>Students</button>
      </div>

      {/* COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course._id} className="bg-gray-900 p-4 rounded">
              <h3>{course.title}</h3>
              <p>{course.description}</p>

              <div className="flex gap-2 mt-2">
                <button onClick={() => handleOpenEditModal(course)}>
                  <Edit2 />
                </button>
                <button onClick={() => handleDeleteCourse(course._id)}>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STUDENTS */}
      {activeTab === 'students' && (
        <div>
          {students.map(st => (
            <div key={st._id} className="bg-gray-900 p-4 rounded mb-2">
              {st.name} - {st.email}
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded w-[500px]">

            <h2 className="text-xl mb-4">
              {isEditing ? 'Edit Course' : 'Add Course'}
            </h2>

            <form onSubmit={handleSubmitCourse} className="space-y-3">

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full p-2 bg-black"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full p-2 bg-black"
              />

              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration"
                className="w-full p-2 bg-black"
              />

              <button type="submit" className="bg-blue-600 px-4 py-2">
                Save
              </button>

              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="ml-2"
              >
                Cancel
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
