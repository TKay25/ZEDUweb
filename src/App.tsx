import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Landing Pages
import { Landing } from './pages/landing/Landing';
import { About } from './pages/landing/About';
import { Features } from './pages/landing/Features';
import { Contact } from './pages/landing/Contact';
import { Pricing } from './pages/landing/Pricing';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';

// Student Pages
import { StudentDashboard } from './pages/student/Dashboard';
import { Courses as StudentCourses } from './pages/student/Courses';
import { CourseView as StudentCourseView } from './pages/student/CourseView';
import { Lessons as StudentLessons } from './pages/student/Lessons';
import { Assignments as StudentAssignments } from './pages/student/Assignments';
import { Quizzes as StudentQuizzes } from './pages/student/Quizzes';
import { StudentGrades } from './pages/student/Grades';
import { Attendance as StudentAttendance } from './pages/student/Attendance';
import { LiveClass as StudentLiveClass } from './pages/student/LiveClass';
import { AITutor as StudentAITutor } from './pages/student/AITutor';
import { Library as StudentLibrary } from './pages/student/Library';
import { Portfolio as StudentPortfolio } from './pages/student/Portfolio';
import { Career as StudentCareer } from './pages/student/Career';
import { Scholarships as StudentScholarships } from './pages/student/Scholarships';
import { Certificates as StudentCertificates } from './pages/student/Certificates';

// Tutor Pages
import { TutorDashboard } from './pages/tutor/Dashboard';
import { Classes as TutorClasses } from './pages/tutor/Classes';
import { Students as TutorStudents } from './pages/tutor/Students';
import { Courses as TutorCourses } from './pages/tutor/Courses';
import { CreateCourse as TutorCreateCourse } from './pages/tutor/CreateCourse';
import { EditCourse as TutorEditCourse } from './pages/tutor/EditCourse';
import { Lessons as TutorLessons } from './pages/tutor/Lessons';
import { Content as TutorContent } from './pages/tutor/Content';
import { Assignments as TutorAssignments } from './pages/tutor/Assignments';
import { Quizzes as TutorQuizzes } from './pages/tutor/Quizzes';
import { GradeSubmissions as TutorGradeSubmissions } from './pages/tutor/GradeSubmissions';
import { Attendance as TutorAttendance } from './pages/tutor/Attendance';
import { LiveSession as TutorLiveSession } from './pages/tutor/LiveSession';
import { Analytics as TutorAnalytics } from './pages/tutor/Analytics';
import { Earnings as TutorEarnings } from './pages/tutor/Earnings';
import TutorProfile from './pages/tutor/Profile';

// Parent Pages
import { ParentDashboard } from './pages/parent/Dashboard';
import { ParentProfile } from './pages/parent/Profile';
import { Children as ParentChildren } from './pages/parent/Children';
import { ChildProgress as ParentChildProgress } from './pages/parent/ChildProgress';
import { ChildGrades as ParentChildGrades } from './pages/parent/ChildGrades';
import { ChildAttendance as ParentChildAttendance } from './pages/parent/ChildAttendance';
import { Communications as ParentCommunications } from './pages/parent/Communications';
import { Meetings as ParentMeetings } from './pages/parent/Meetings';
import { Payments as ParentPayments } from './pages/parent/Payments';
import { Invoice as ParentInvoices } from './pages/parent/Invoices';
import { Alerts as ParentAlerts } from './pages/parent/Alerts';

// School Pages
import { SchoolDashboard } from './pages/school/Dashboard';
import { SchoolProfile } from './pages/school/Profile';
import { Students as SchoolStudents } from './pages/school/Students';
import { Staff as SchoolStaff } from './pages/school/Staff';
import { Classes as SchoolClasses } from './pages/school/Classes';
import { Timetable as SchoolTimetable } from './pages/school/Timetable';
import { Curriculum as SchoolCurriculum } from './pages/school/Curriculum';
import { Admissions as SchoolAdmissions } from './pages/school/Admissions';
import { Attendance as SchoolAttendance } from './pages/school/Attendance';
import { Exams as SchoolExams } from './pages/school/Exams';
import { Results as SchoolResults } from './pages/school/Results';
import { Fees as SchoolFees } from './pages/school/Fees';
import { Communications as SchoolCommunications } from './pages/school/Communications';
import { Analytics as SchoolAnalytics } from './pages/school/Analytics';
import { Verification as SchoolVerification } from './pages/school/Verification';

// Ministry Pages
import { MinistryDashboard } from './pages/ministry/Dashboard';
import { MinistryProfile } from './pages/ministry/Profile';
import { Schools as MinistrySchools } from './pages/ministry/Schools';
import { SchoolDetail as MinistrySchoolDetail } from './pages/ministry/SchoolDetail';
import { MinistryVerification } from './pages/ministry/Verification';
import { MinistryStudents } from './pages/ministry/Students';
import { MinistryTutors } from './pages/ministry/Tutors';
import { MinistryCurriculum } from './pages/ministry/Curriculum';
import { Performance as MinistryPerformance } from './pages/ministry/Performance';
import { Compliance as MinistryCompliance } from './pages/ministry/Compliance';
import { Policies as MinistryPolicies } from './pages/ministry/Policies';
import { Reports as MinistryReports } from './pages/ministry/Reports';
import { MinistryCommunications } from './pages/ministry/Communications';
import { SystemHealth as MinistrySystemHealth } from './pages/ministry/SystemHealth';

// Common Pages
import { Profile } from './pages/common/Profile';
import { Settings } from './pages/common/Settings';
import { Notifications } from './pages/common/Notifications';
import { Messages } from './pages/common/Messages';
import { Help } from './pages/common/Help';
import { Terms } from './pages/common/Terms';
import { Privacy } from './pages/common/Privacy';
import { NotFound } from './pages/common/NotFound';
import { Unauthorized } from './pages/common/Unauthorized';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <SocketProvider>
              <NotificationProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Landing />} />
                    <Route path="about" element={<About />} />
                    <Route path="features" element={<Features />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="privacy" element={<Privacy />} />
                  </Route>

                  {/* Auth Routes */}
                  <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="verify-email" element={<VerifyEmail />} />
                  </Route>

                  {/* Alternative direct auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />

                  {/* Protected Student Routes */}
                  <Route path="/student" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="courses" element={<StudentCourses />} />
                    <Route path="courses/:id" element={<StudentCourseView />} />
                    <Route path="lessons" element={<StudentLessons />} />
                    <Route path="assignments" element={<StudentAssignments />} />
                    <Route path="quizzes" element={<StudentQuizzes />} />
                    <Route path="grades" element={<StudentGrades />} />
                    <Route path="attendance" element={<StudentAttendance />} />
                    <Route path="live-class" element={<StudentLiveClass />} />
                    <Route path="ai-tutor" element={<StudentAITutor />} />
                    <Route path="library" element={<StudentLibrary />} />
                    <Route path="portfolio" element={<StudentPortfolio />} />
                    <Route path="career" element={<StudentCareer />} />
                    <Route path="scholarships" element={<StudentScholarships />} />
                    <Route path="certificates" element={<StudentCertificates />} />
                  </Route>

                  {/* Protected Tutor Routes */}
                  <Route path="/tutor" element={
                    <ProtectedRoute allowedRoles={['tutor']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<TutorDashboard />} />
                    <Route path="profile" element={<TutorProfile />} />
                    <Route path="classes" element={<TutorClasses />} />
                    <Route path="students" element={<TutorStudents />} />
                    <Route path="courses" element={<TutorCourses />} />
                    <Route path="courses/create" element={<TutorCreateCourse />} />
                    <Route path="courses/:id/edit" element={<TutorEditCourse />} />
                    <Route path="lessons" element={<TutorLessons />} />
                    <Route path="content" element={<TutorContent />} />
                    <Route path="assignments" element={<TutorAssignments />} />
                    <Route path="quizzes" element={<TutorQuizzes />} />
                    <Route path="grade-submissions" element={<TutorGradeSubmissions />} />
                    <Route path="attendance" element={<TutorAttendance />} />
                    <Route path="live-session" element={<TutorLiveSession />} />
                    <Route path="analytics" element={<TutorAnalytics />} />
                    <Route path="earnings" element={<TutorEarnings />} />
                  </Route>

                  {/* Protected Parent Routes */}
                  <Route path="/parent" element={
                    <ProtectedRoute allowedRoles={['parent']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<ParentDashboard />} />
                    <Route path="profile" element={<ParentProfile />} />
                    <Route path="children" element={<ParentChildren />} />
                    <Route path="children/:id/progress" element={<ParentChildProgress />} />
                    <Route path="children/:id/grades" element={<ParentChildGrades />} />
                    <Route path="children/:id/attendance" element={<ParentChildAttendance />} />
                    <Route path="communications" element={<ParentCommunications />} />
                    <Route path="meetings" element={<ParentMeetings />} />
                    <Route path="payments" element={<ParentPayments />} />
                    <Route path="invoices" element={<ParentInvoices />} />
                    <Route path="alerts" element={<ParentAlerts />} />
                  </Route>

                  {/* Protected School Routes */}
                  <Route path="/school" element={
                    <ProtectedRoute allowedRoles={['school_admin']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<SchoolDashboard />} />
                    <Route path="profile" element={<SchoolProfile />} />
                    <Route path="students" element={<SchoolStudents />} />
                    <Route path="staff" element={<SchoolStaff />} />
                    <Route path="classes" element={<SchoolClasses />} />
                    <Route path="timetable" element={<SchoolTimetable />} />
                    <Route path="curriculum" element={<SchoolCurriculum />} />
                    <Route path="admissions" element={<SchoolAdmissions />} />
                    <Route path="attendance" element={<SchoolAttendance />} />
                    <Route path="exams" element={<SchoolExams />} />
                    <Route path="results" element={<SchoolResults />} />
                    <Route path="fees" element={<SchoolFees />} />
                    <Route path="communications" element={<SchoolCommunications />} />
                    <Route path="analytics" element={<SchoolAnalytics />} />
                    <Route path="verification" element={<SchoolVerification />} />
                  </Route>

                  {/* Protected Ministry Routes */}
                  <Route path="/ministry" element={
                    <ProtectedRoute allowedRoles={['ministry_official']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<MinistryDashboard />} />
                    <Route path="profile" element={<MinistryProfile />} />
                    <Route path="schools" element={<MinistrySchools />} />
                    <Route path="schools/:id" element={<MinistrySchoolDetail />} />
                    <Route path="verification" element={<MinistryVerification />} />
                    <Route path="students" element={<MinistryStudents />} />
                    <Route path="tutors" element={<MinistryTutors />} />
                    <Route path="curriculum" element={<MinistryCurriculum />} />
                    <Route path="performance" element={<MinistryPerformance />} />
                    <Route path="compliance" element={<MinistryCompliance />} />
                    <Route path="policies" element={<MinistryPolicies />} />
                    <Route path="reports" element={<MinistryReports />} />
                    <Route path="communications" element={<MinistryCommunications />} />
                    <Route path="system-health" element={<MinistrySystemHealth />} />
                  </Route>

                  {/* Common Protected Routes */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Profile />} />
                  </Route>
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Settings />} />
                  </Route>
                  
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Notifications />} />
                  </Route>
                  
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Messages />} />
                  </Route>
                  
                  <Route path="/help" element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Help />} />
                  </Route>

                  {/* Error Routes */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </NotificationProvider>
            </SocketProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;