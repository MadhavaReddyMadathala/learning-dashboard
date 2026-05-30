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

// ✅ FIXED: BASE + /api pattern
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = `${BASE}/api`;

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
      // ✅ FIXED: no duplicate /api
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

    const payload = { title, description, thumbnail, duration, lessons };

    try {
      if (isEditing) {
        // ✅ FIXED: no duplicate /api
        await axios.put(`${API}/courses/${currentCourseId}`, payload);
        setSuccess('Course updated successfully');
      } else {
        // ✅ FIXED: no duplicate /api
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
      // ✅ FIXED: no duplicate /api
      await axios.delete(`${API}/courses/${courseId}`);
      setSuccess('Course deleted');
      fetchAdminData();
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  // ---------------- UI ----------------
  if (loading && courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-10 bg-slate-900 w-1/3 rounded-xl mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-slate-900 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="text-brand-400" /> Admin Panel
          </h1>
          <p className="text-slate-400 mt-1">Manage courses & students</p>
        </div>

        {activeTab === 'courses' && (
          <button
            onClick={handleOpenAddModal}
            className="bg-brand-500 hover:bg-brand-600 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all"
          >
            <Plus size={16} /> Add Course
          </button>
        )}
      </div>

      {/* ALERTS */}
      {success && (
        <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <Check size={16} /> {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-2 mb-8 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'courses'
              ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen size={15} /> Courses
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'students'
              ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users size={15} /> Students
        </button>
      </div>

      {/* COURSES TAB */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 && (
            <p className="text-slate-500 col-span-3 text-center py-12">
              No courses yet. Add your first course!
            </p>
          )}
          {courses.map(course => (
            <div key={course._id} className="glass-panel rounded-2xl overflow-hidden">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-36 object-cover opacity-80"
                />
              )}
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-white text-base line-clamp-1">{course.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{course.lessons?.length || 0} lessons</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleOpenEditModal(course)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-all"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STUDENTS TAB */}
      {activeTab === 'students' && (
        <div className="space-y-3">
          {students.length === 0 && (
            <p className="text-slate-500 text-center py-12">No students enrolled yet.</p>
          )}
          {students.map(st => (
            <div key={st._id} className="glass-panel rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{st.name}</p>
                <p className="text-slate-400 text-sm">{st.email}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold">
                {st.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT COURSE MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {isEditing ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button
                onClick={() => setShowCourseModal(false)}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitCourse} className="space-y-4">

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to React"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief course description..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Duration *</label>
                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 6 hours"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Thumbnail URL</label>
                <input
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
                />
              </div>

              {/* Lessons */}
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Lessons</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={newLessonInput}
                    onChange={(e) => setNewLessonInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLesson())}
                    placeholder="Add a lesson title..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddLesson}
                    className="px-3 py-2.5 bg-brand-500 hover:bg-brand-600 rounded-xl text-white transition-all"
                  >
                    <ListPlus size={16} />
                  </button>
                </div>

                {lessons.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {lessons.map((lesson, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-slate-800/60 px-3 py-2 rounded-lg text-sm"
                      >
                        <span className="text-slate-300 flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-bold w-5">{idx + 1}.</span>
                          {lesson}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLesson(idx)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  {isEditing ? 'Update Course' : 'Create Course'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
