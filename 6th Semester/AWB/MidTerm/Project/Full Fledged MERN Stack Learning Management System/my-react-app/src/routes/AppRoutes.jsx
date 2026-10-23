import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleRoute from '../components/RoleRoute';
import Loader from '../components/Loader';

// ─── Lazy Imports ─────────────────────────────────────────────────────────────
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Courses = lazy(() => import('../pages/Courses'));
const CourseDetails = lazy(() => import('../pages/CourseDetails'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));

const DashboardLayout = lazy(() => import('../pages/dashboard/DashboardLayout'));

const StudentDashboard = lazy(() => import('../pages/dashboard/student/StudentDashboard'));
const MyCourses = lazy(() => import('../pages/dashboard/student/MyCourses'));
const Profile = lazy(() => import('../pages/dashboard/student/Profile'));
const MyCertificates = lazy(() => import('../pages/dashboard/student/MyCertificates'));
const MyWishlist = lazy(() => import('../pages/dashboard/student/MyWishlist'));
const MyProgress = lazy(() => import('../pages/dashboard/student/MyProgress'));
const AcademicRecords = lazy(() => import('../pages/dashboard/student/AcademicRecords'));
const StudentAcademicContent = lazy(() => import('../pages/dashboard/student/StudentAcademicContent'));

const InstructorDashboard = lazy(() => import('../pages/dashboard/instructor/InstructorDashboard'));
const CreateCourse = lazy(() => import('../pages/dashboard/instructor/CreateCourse'));
const InstructorManageCourses = lazy(() => import('../pages/dashboard/instructor/ManageCourses'));
const UploadLesson = lazy(() => import('../pages/dashboard/instructor/UploadLesson'));
const AcademicManager = lazy(() => import('../pages/dashboard/instructor/AcademicManager'));

const AdminDashboard = lazy(() => import('../pages/dashboard/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('../pages/dashboard/admin/ManageUsers'));
const AdminManageCourses = lazy(() => import('../pages/dashboard/admin/ManageCourses'));
const Analytics = lazy(() => import('../pages/dashboard/admin/Analytics'));
const NotificationOversight = lazy(() => import('../pages/dashboard/admin/NotificationOversight'));

// New feature pages
const QuizPage = lazy(() => import('../pages/QuizPage'));
const ChatPage = lazy(() => import('../pages/ChatPage'));
const LessonPlayer = lazy(() => import('../pages/LessonPlayer'));
const VerifyCertificate = lazy(() => import('../pages/VerifyCertificate'));

// ─── Sidebar Configs ──────────────────────────────────────────────────────────
const STUDENT_SIDEBAR = [
  { path: '/student/dashboard', label: 'Dashboard', icon: 'speedometer2' },
  { path: '/student/courses', label: 'My Courses', icon: 'book' },
  { path: '/student/certificates', label: 'My Certificates', icon: 'award' },
  { path: '/student/wishlist', label: 'My Wishlist', icon: 'heart' },
  { path: '/student/progress', label: 'My Progress', icon: 'graph-up-arrow' },
  { path: '/student/academic-records', label: 'Academic Records', icon: 'journal-text' },
  { path: '/student/profile', label: 'Profile', icon: 'person' },
];

const INSTRUCTOR_SIDEBAR = [
  { path: '/instructor/dashboard', label: 'Dashboard', icon: 'speedometer2' },
  { path: '/instructor/create-course', label: 'Create Course', icon: 'plus-circle' },
  { path: '/instructor/courses', label: 'Manage Courses', icon: 'book' },
  { path: '/instructor/upload-lesson', label: 'Upload Lesson', icon: 'cloud-upload' },
  { path: '/instructor/academic', label: 'Academic Manager', icon: 'clipboard-check' },
];

const ADMIN_SIDEBAR = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'speedometer2' },
  { path: '/admin/users', label: 'Manage Users', icon: 'people' },
  { path: '/admin/courses', label: 'Manage Courses', icon: 'book' },
  { path: '/admin/analytics', label: 'Analytics', icon: 'graph-up' },
  { path: '/admin/notifications', label: 'Notifications', icon: 'bell' },
];

// ─── Routes ───────────────────────────────────────────────────────────────────
const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:certificateId" element={<VerifyCertificate />} />

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['student']}>
                <DashboardLayout sidebarItems={STUDENT_SIDEBAR} />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="profile" element={<Profile />} />
          <Route path="certificates" element={<MyCertificates />} />
          <Route path="wishlist" element={<MyWishlist />} />
          <Route path="progress" element={<MyProgress />} />
          <Route path="academic-records" element={<AcademicRecords />} />
          <Route path="course/:courseId" element={<StudentAcademicContent />} />
          <Route path="quiz/:courseId" element={<QuizPage />} />
          <Route path="chat/:courseId" element={<ChatPage />} />
          <Route path="learn/:courseId" element={<LessonPlayer />} />
          <Route path="learn/:courseId/:lessonId" element={<LessonPlayer />} />
        </Route>

        {/* Instructor */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['instructor']}>
                <DashboardLayout sidebarItems={INSTRUCTOR_SIDEBAR} />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/instructor/dashboard" replace />} />
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="courses" element={<InstructorManageCourses />} />
          <Route path="upload-lesson" element={<UploadLesson />} />
          <Route path="academic" element={<AcademicManager />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['admin']}>
                <DashboardLayout sidebarItems={ADMIN_SIDEBAR} />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="courses" element={<AdminManageCourses />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<NotificationOversight />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
