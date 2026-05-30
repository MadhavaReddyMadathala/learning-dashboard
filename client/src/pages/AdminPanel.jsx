import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, BookOpen, Users, ListPlus, X, Sparkles, Check } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' or 'students'
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form States for adding/editing courses
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [duration, setDuration] = useState('');
  const [lessons, setLessons] = useState([]);
  const [newLessonInput, setNewLessonInput] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const coursesRes = await axios.get(`${API}/api/courses`);
      setCourses(coursesRes.data);

      const studentsRes = await axios.get(`${API}/api/admin/students`);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch administration logs');
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
    setLessons([...course.lessons]);
    setNewLessonInput('');
    setShowCourseModal(true);
  };

  const handleAddLesson = () => {
    if (!newLessonInput.trim()) return;
    setLessons([...lessons, newLessonInput.trim()]);
    setNewLessonInput('');
  };

  const handleRemoveLesson = (idxToRemove) => {
    setLessons(lessons.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!title || !description || !duration) {
      setError('Please provide title, description, and duration.');
      return;
    }

    const payload = {
      title,
      description,
      thumbnail: thumbnail || undefined,
      duration,
      lessons,
    };

    try {
      if (isEditing) {
        await axios.put(`${API}/api/courses/${currentCourseId}`, payload);
        setSuccess('Course updated successfully!');
      } else {
        await axios.post(`${API}/api/courses`, payload);
        setSuccess('Course created successfully!');
      }
      setShowCourseModal(false);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving course data.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action is irreversible.')) return;
    clearAlerts();
    try {
      await axios.delete(`${API}/api/courses/${courseId}`);
      setSuccess('Course successfully deleted');
      fetchAdminData();
    } catch (err) {
      setError('Error deleting course.');
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
        <div className="h-10 bg-slate-900 w-1/4 rounded-xl mb-10"></div>
        <div className="h-44 bg-slate-900 rounded-3xl mb-8"></div>
        <div className="h-96 bg-slate-900 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* Title Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight flex items-center space-x-3">
            <Sparkles className="text-brand-400" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Configure system courses, add syllabus curricula, and review student progress metrics.
          </p>
        </div>

        {activeTab === 'courses' && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-lg shadow-brand-500/25 transition-all"
          >
            <Plus size={16} />
            <span>Add New Course</span>
          </button>
        )}
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center space-x-2">
          <Check size={16} />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 mb-8">
        <button
          onClick={() => { setActiveTab('courses'); clearAlerts(); }}
          className={`flex items-center space-x-2 pb-4 px-6 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'courses'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen size={16} />
          <span>Courses Manager</span>
        </button>
        <button
          onClick={() => { setActiveTab('students'); clearAlerts(); }}
          className={`flex items-center space-x-2 pb-4 px-6 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'students'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users size={16} />
          <span>Student Progress Logs</span>
        </button>
      </div>

      {/* Tab Content 1: Course Manager */}
      {activeTab === 'courses' && (
        <div className="glass-panel rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4.5 px-6">Course info</th>
                  <th className="py-4.5 px-6">Duration</th>
                  <th className="py-4.5 px-6">Lessons Count</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 px-6 text-center text-slate-500 text-sm">
                      No courses available. Start by adding a new course.
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course._id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-800"
                          />
                          <div>
                            <span className="block font-semibold text-white text-sm sm:text-base leading-snug">{course.title}</span>
                            <span className="block text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-sm">{course.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-sm font-medium text-slate-300">
                        {course.duration}
                      </td>
                      <td className="py-5 px-6 text-sm font-semibold text-brand-400">
                        {course.lessons.length} Modules
                      </td>
                      <td className="py-5 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(course)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Course"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Student Progress Logs */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {students.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center text-slate-500 text-sm">
              No students found in the database.
            </div>
          ) : (
            students.map((student) => (
              <div 
                key={student._id} 
                className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-start gap-6 border border-slate-800 shadow-md"
              >
                {/* Student Personal details */}
                <div className="md:w-1/4 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-display font-extrabold text-lg">
                    {student.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base leading-snug">{student.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{student.email}</p>
                  </div>
                </div>

                {/* Course Enrollments & Progress Info */}
                <div className="flex-1 space-y-4">
                  <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    Enrolled Courses & Progress ({student.enrollments.length})
                  </h4>

                  {student.enrollments.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">This student is not enrolled in any courses yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {student.enrollments.map((enr, i) => (
                        <div key={i} className="bg-slate-900/60 border border-slate-850 rounded-2xl p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="block font-semibold text-sm text-white line-clamp-1 leading-snug">
                                {enr.courseTitle}
                              </span>
                              <span className="block text-[10px] text-slate-500 mt-0.5">
                                {enr.completedLessonsCount} / {enr.totalLessonsCount} lessons finished
                              </span>
                            </div>
                            <span className="font-display font-extrabold text-sm text-brand-400">
                              {enr.progress}%
                            </span>
                          </div>

                          {/* Progress Line bar */}
                          <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-500 rounded-full transition-all duration-500"
                              style={{ width: `${enr.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal View for Add / Edit Course */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="font-display font-bold text-xl text-white">
                {isEditing ? 'Modify Course Profile' : 'Construct New Course'}
              </h2>
              <button 
                onClick={() => setShowCourseModal(false)}
                className="p-1 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitCourse} className="space-y-5">
              {/* Course Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-500 text-sm"
                  placeholder="e.g. Introductory CSS Frameworks"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-500 text-sm"
                  placeholder="Write a descriptive course overview..."
                  required
                />
              </div>

              {/* Thumbnail URL & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Thumbnail Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-500 text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-500 text-sm"
                    placeholder="e.g. 5 Hours"
                    required
                  />
                </div>
              </div>

              {/* Lessons Syllabus Builder */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Curriculum Lessons ({lessons.length})
                </label>
                
                {/* Lesson inputs */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newLessonInput}
                    onChange={(e) => setNewLessonInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-500 text-sm"
                    placeholder="Add lesson name (e.g. Lesson 1: Basics)"
                  />
                  <button
                    type="button"
                    onClick={handleAddLesson}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 px-4 rounded-xl text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center space-x-1"
                  >
                    <ListPlus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Lesson List displays */}
                <div className="max-h-44 overflow-y-auto space-y-2 bg-slate-950 border border-slate-800 rounded-xl p-3">
                  {lessons.length === 0 ? (
                    <span className="text-slate-500 text-xs italic block text-center py-4">No lessons added yet.</span>
                  ) : (
                    lessons.map((lesson, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center bg-slate-900 border border-slate-800 py-2 px-3 rounded-lg text-xs text-slate-300"
                      >
                        <span className="font-medium truncate max-w-md">{lesson}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLesson(index)}
                          className="text-rose-500 hover:text-rose-400 p-1 hover:bg-slate-950 rounded-md transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider py-3 px-5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider py-3 px-5 rounded-xl shadow-md shadow-brand-500/25 transition-all"
                >
                  Save Course
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
