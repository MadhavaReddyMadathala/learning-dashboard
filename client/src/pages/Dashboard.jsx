import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Award, ArrowRight, PlayCircle, Clock, BookMarked, Activity } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const { data: coursesData } = await axios.get(`${API}/api/courses`);
      setCourses(coursesData);

      // Check progress for each course to check if enrolled
      const enrollmentsMap = {};
      await Promise.all(
        coursesData.map(async (course) => {
          try {
            const { data: progressData } = await axios.get(`${API}/api/progress/${course._id}`);
            enrollmentsMap[course._id] = progressData;
          } catch (err) {
            // Not enrolled (404) or failed
            enrollmentsMap[course._id] = null;
          }
        })
      );
      setEnrollments(enrollmentsMap);
    } catch (err) {
      console.error(err);
      setError('Could not load course dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    setError(null);
    try {
      await axios.post(`${API}/api/enroll/${courseId}`);
      // Refresh data
      await fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed. Please try again.');
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 animate-pulse">
        <div className="h-10 bg-slate-900 w-1/3 rounded-xl mb-6"></div>
        <div className="h-4 bg-slate-900 w-1/4 rounded-xl mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-slate-900 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* Dashboard Welcome Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Welcome back, <span className="text-brand-300 font-semibold">{user.name}</span>. Start learning today!
          </p>
        </div>

        {/* Mini Stats Board */}
        <div className="flex items-center space-x-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center space-x-3 pr-4 border-r border-slate-800">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
              <BookMarked size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Enrolled</p>
              <p className="text-base font-bold text-white">
                {Object.values(enrollments).filter(Boolean).length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Award size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Completed</p>
              <p className="text-base font-bold text-white">
                {Object.values(enrollments).filter(e => e && e.progress === 100).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Grid Content */}
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-6 flex items-center space-x-2">
            <BookOpen size={18} className="text-brand-400" />
            <span>Available Courses</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const enrollment = enrollments[course._id];
              const isEnrolled = !!enrollment;

              return (
                <div 
                  key={course._id} 
                  className="glass-panel glass-panel-hover flex flex-col rounded-3xl overflow-hidden group shadow-lg"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                    <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-slate-950/80 text-brand-300 border border-slate-800">
                      {course.lessons.length} Lessons
                    </span>
                  </div>

                  {/* Course Details Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-display font-bold text-lg text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Meta duration info */}
                      <div className="flex items-center text-xs text-slate-500 font-medium space-x-4">
                        <span className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{course.duration}</span>
                        </span>
                      </div>

                      {/* Enrollment status UI */}
                      {isEnrolled ? (
                        <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-semibold flex items-center space-x-1">
                              <Activity size={10} className="text-brand-400" />
                              <span>Learning Progress</span>
                            </span>
                            <span className="font-bold text-brand-400">{enrollment.progress}%</span>
                          </div>
                          
                          {/* Progress Line */}
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-500 rounded-full"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>

                          <Link
                            to={`/course/${course._id}`}
                            className="flex items-center justify-center space-x-2 w-full text-xs font-semibold py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
                          >
                            <PlayCircle size={14} />
                            <span>Continue Learning</span>
                          </Link>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrollingId === course._id}
                          className="flex items-center justify-center space-x-2 w-full text-sm font-semibold py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-md shadow-brand-500/10 transition-all disabled:opacity-50"
                        >
                          {enrollingId === course._id ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <span>Enroll in Course</span>
                              <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
