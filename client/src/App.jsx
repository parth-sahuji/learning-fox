import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, RedirectIfLoggedIn } from './components/AuthGuard';
import StickyHeader from './components/StickyHeader';
import WhatsAppFloat from './components/WhatsAppFloat';
import Layout from './components/Layout';

import Login         from './pages/Login';
import About         from './pages/About';
import Register      from './pages/Register';
import PendingApproval from './pages/PendingApproval';
import Terms         from './pages/Terms';

import AdminDashboard from './pages/admin/Dashboard';
import Vetting       from './pages/admin/Vetting';
import Matcher       from './pages/admin/Matcher';
import Assignments   from './pages/admin/Assignments';
import AdminFees     from './pages/admin/Fees';
import AdminStudents from './pages/admin/Students';
import AdminTeachers from './pages/admin/Teachers';

import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherProfile   from './pages/teacher/Profile';
import Portfolio        from './pages/teacher/Portfolio';
import TeacherFees      from './pages/teacher/Fees';

import StudentDashboard from './pages/student/Dashboard';
import StudentProfile   from './pages/student/Profile';
import StudentFees      from './pages/student/Fees';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <StickyHeader />
          <WhatsAppFloat />
          <Routes>
            <Route path="/terms"    element={<Terms />} />
            <Route path="/about"    element={<About />} />
            <Route path="/pending"  element={<PendingApproval />} />
            <Route path="/rejected" element={<PendingApproval />} />

            <Route element={<RedirectIfLoggedIn />}>
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* ADMIN */}
            <Route element={<RequireAuth allowedRoles={['admin']} />}>
              <Route element={<Layout />}>
                <Route path="/admin"              element={<AdminDashboard />} />
                <Route path="/admin/vetting"      element={<Vetting />} />
                <Route path="/admin/matcher"      element={<Matcher />} />
                <Route path="/admin/assignments"  element={<Assignments />} />
                <Route path="/admin/students"     element={<AdminStudents />} />
                <Route path="/admin/teachers"     element={<AdminTeachers />} />
                <Route path="/admin/fees"         element={<AdminFees />} />
              </Route>
            </Route>

            {/* TEACHER */}
            <Route element={<RequireAuth allowedRoles={['teacher']} />}>
              <Route element={<Layout />}>
                <Route path="/teacher"            element={<TeacherDashboard />} />
                <Route path="/teacher/profile"    element={<TeacherProfile />} />
                <Route path="/teacher/portfolio"  element={<Portfolio />} />
                <Route path="/teacher/fees"       element={<TeacherFees />} />
              </Route>
            </Route>

            {/* STUDENT */}
            <Route element={<RequireAuth allowedRoles={['student']} />}>
              <Route element={<Layout />}>
                <Route path="/student"          element={<StudentDashboard />} />
                <Route path="/student/profile"  element={<StudentProfile />} />
                <Route path="/student/fees"     element={<StudentFees />} />
              </Route>
            </Route>

            <Route path="/" element={<About />} />
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '56px', background: '#0f0a06' }}>
                <div className="text-center">
                  <img src="/fox-logo.png" alt="" className="w-20 h-20 mx-auto object-contain mb-4 opacity-40" />
                  <h1 className="font-display text-3xl font-bold text-white mb-2">Page Not Found</h1>
                  <a href="/login" className="btn-primary inline-block mt-4">Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
