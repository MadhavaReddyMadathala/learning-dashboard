import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, CheckCircle2, Circle, Clock, BookOpen, AlertCircle, PlayCircle } from 'lucide-react';

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = `${BASE}/api`;

const CourseDetail = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingLesson, setUpdatingLesson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        // Fetch course details
        const { data: courseData } = await axios.get(`${API}/api/courses/${courseId}`);
        setCourse(courseData);

        // Fetch user progress for course
        const { data: enrollmentData } = await axios.get(`${API}/api/progress/${courseId}`);
        setEnrollment(enrollmentData);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setError('You are not enrolled in this course.');
        } else {
          setError('Failed to fetch course details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [courseId]);

  const handleToggleLesson = async (lessonTitle) => {
    if (updatingLesson) return;
    setUpdatingLesson(lessonTitle);
    
    try {
      const { data } = await axios.put(`${API}/api/progress/${courseId}`, { lessonTitle });
      setEnrollment(data);
    } catch (err) {
      console.error(err);
      setError('Failed to update progress.');
    } finally {
      setUpdatingLesson(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 animate-pulse">
        <div className="h-6 bg-slate-900 w-16 rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-20 bg-slate-900 rounded-3xl"></div>
            <div className="h-60 bg-slate-900 rounded-3xl"></div>
          </div>
          <div className="h-80 bg-slate-900 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="inline-flex bg-amber-500/10 text-amber-400 p-4 rounded-full mb-4 border border-amber-500/20">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{error}</h2>
        <p className="text-slate-400 mb-6">You must be enrolled to view this course's curriculum.</p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/dashboard"
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 font-semibold text-white transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* Back navigation */}
      <Link 
        to="/dashboard" 
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-400 hover:text-white mb-8 transition-colors group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Curriculum & Lessons */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Info */}
          <div className="space-y-4">
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Lessons List Card */}
          <div className="glass-panel rounded-3xl p-6 md:p-8">
            <h2 className="font-display font-bold text-xl text-white mb-6 flex items-center space-x-2">
              <BookOpen size={20} className="text-brand-400" />
              <span>Curriculum Syllabus</span>
            </h2>

            <div className="space-y-3">
              {course.lessons.map((lesson, idx) => {
                const isCompleted = enrollment.completedLessons.includes(lesson);
                const isToggling = updatingLesson === lesson;

                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleLesson(lesson)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none group ${
                      isCompleted 
                        ? 'bg-brand-500/5 border-brand-500/20 text-brand-300' 
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg ${
                        isCompleted ? 'bg-brand-500/10 text-brand-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-medium text-sm sm:text-base leading-snug">{lesson}</span>
                    </div>

                    <button
                      type="button"
                      disabled={isToggling}
                      className={`p-1 rounded-full transition-transform duration-300 active:scale-90 ${
                        isCompleted ? 'text-brand-400' : 'text-slate-600 group-hover:text-slate-400'
                      }`}
                    >
                      {isToggling ? (
                        <div className="w-5 h-5 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin"></div>
                      ) : isCompleted ? (
                        <CheckCircle2 size={22} className="fill-brand-500/10" />
                      ) : (
                        <Circle size={22} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Progress Board Card */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl overflow-hidden shadow-xl border border-slate-800">
            {/* Image Banner */}
            <div className="h-44 w-full bg-slate-900">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover opacity-70"
              />
            </div>

            {/* Sidebar Stats Panel */}
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Progress Tracker</span>
                <span className="text-brand-400 font-display text-sm lowercase font-medium">live stats</span>
              </div>

              {/* Progress Circle Visual */}
              <div className="flex flex-col items-center py-4 bg-slate-900/30 rounded-2xl border border-slate-800/40">
                <div className="relative flex items-center justify-center">
                  
                  {/* SVG Circle */}
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="52"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-850"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="52"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-brand-500 transition-all duration-700 ease-out"
                      strokeDasharray={2 * Math.PI * 52}
                      strokeDashoffset={2 * Math.PI * 52 * (1 - enrollment.progress / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-display font-extrabold text-3xl text-white">
                      {enrollment.progress}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      complete
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between space-x-6 text-xs text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
                    <span>Done: {enrollment.completedLessons.length}</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
                    <span>Left: {course.lessons.length - enrollment.completedLessons.length}</span>
                  </span>
                </div>
              </div>

              {/* Metadata Details list */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-sm py-2.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <Clock size={16} />
                    <span>Duration</span>
                  </span>
                  <span className="font-bold text-white text-right">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <PlayCircle size={16} />
                    <span>Total Lessons</span>
                  </span>
                  <span className="font-bold text-white text-right">{course.lessons.length}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CourseDetail;
