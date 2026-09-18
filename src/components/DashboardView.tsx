import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { ACADEMY_INFO } from '../data/seedData';
import { formatCurrency } from '../utils/academicUtils';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  CreditCard,
  UserPlus,
  ClipboardCheck,
  FileSpreadsheet,
  Megaphone,
  Clock,
  MapPin,
  Award,
  ChevronRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    role,
    students,
    faculty,
    courses,
    invoices,
    announcements,
    timetable,
    activeStudentId,
    activeTeacherId,
    setActiveTab,
    setSelectedStudentForModal,
    setSelectedStudentForReportCard,
  } = useSchool();

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];
  const activeTeacher = faculty.find(f => f.id === activeTeacherId) || faculty[0];

  // Computations
  const totalStudentsCount = ACADEMY_INFO.totalEnrollment;
  const sampleStudentsCount = students.length;
  const honorsStudents = students.filter(s => s.status === 'Honors');
  const avgGPA = (students.reduce((acc, s) => acc + s.gpa, 0) / sampleStudentsCount).toFixed(2);
  const avgAttendance = (
    students.reduce((acc, s) => acc + s.attendanceRate, 0) / sampleStudentsCount
  ).toFixed(1);

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const collectionRate = Math.round((totalPaid / totalInvoiced) * 100);

  // Student specific computation
  const studentInvoices = invoices.filter(i => i.studentId === activeStudent?.id);
  const studentBalance = studentInvoices.reduce((acc, i) => acc + (i.totalAmount - i.paidAmount), 0);
  const studentCourses = courses.filter(c => activeStudent?.courses?.includes(c.id));

  // Teacher specific computation
  const teacherCourses = courses.filter(c => activeTeacher?.coursesAssigned?.includes(c.id));

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 lg:p-8 text-white border border-slate-700 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <GraduationCap className="w-64 h-64 text-emerald-300" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {role === 'admin' && 'Principal & Executive Console'}
              {role === 'teacher' && `Faculty Workstation • ${activeTeacher.name}`}
              {role === 'student' && `Student Scholar File • ${activeStudent.firstName} ${activeStudent.lastName}`}
              {role === 'parent' && `Guardian Portal • Child: ${activeStudent.firstName} ${activeStudent.lastName}`}
            </span>
            <span className="text-xs text-slate-400">Academic Year {ACADEMY_INFO.academicYear}</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-cinzel font-bold tracking-tight text-white mb-2">
            {role === 'admin' && 'Mount Olive Academy Command Overview'}
            {role === 'teacher' && `Welcome, ${activeTeacher.name}`}
            {role === 'student' && `Welcome back, ${activeStudent.firstName}`}
            {role === 'parent' && `Guardian Dashboard for ${activeStudent.firstName}`}
          </h2>

          <p className="text-slate-300 text-xs lg:text-sm leading-relaxed mb-6 max-w-2xl">
            {role === 'admin' &&
              'Manage institutional admissions, monitor real-time class attendance, audit academic gradebooks, oversee faculty schedules, and review tuition collections.'}
            {role === 'teacher' &&
              `Assigned to ${teacherCourses.length} honors & AP courses in the ${activeTeacher.department}. Daily attendance roll and grade entry are synchronized.`}
            {role === 'student' &&
              `Enrolled in Grade ${activeStudent.grade}, Section ${activeStudent.section}. Current Cumulative GPA is ${activeStudent.gpa} with an exemplary ${activeStudent.attendanceRate}% attendance record.`}
            {role === 'parent' &&
              `Viewing real-time academic progress, daily attendance reports, quarterly report cards, and fee accounts for ${activeStudent.firstName} ${activeStudent.lastName}.`}
          </p>

          {/* Quick Action Buttons based on role */}
          <div className="flex flex-wrap gap-2.5">
            {role === 'admin' && (
              <>
                <button
                  id="dash-enroll-btn"
                  onClick={() => setActiveTab('students')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Enroll New Student
                </button>
                <button
                  id="dash-attendance-btn"
                  onClick={() => setActiveTab('attendance')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Mark Attendance
                </button>
                <button
                  id="dash-gradebook-btn"
                  onClick={() => setActiveTab('gradebook')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                  Open Gradebook
                </button>
                <button
                  id="dash-notice-btn"
                  onClick={() => setActiveTab('bulletin')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                  Broadcast Notice
                </button>
              </>
            )}

            {role === 'teacher' && (
              <>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  Take Course Roll Call
                </button>
                <button
                  onClick={() => setActiveTab('gradebook')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  Enter Exam & HW Grades
                </button>
                <button
                  onClick={() => setActiveTab('timetable')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  View Teaching Schedule
                </button>
              </>
            )}

            {role === 'student' && (
              <>
                <button
                  onClick={() => setSelectedStudentForReportCard(activeStudent)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Download Official Report Card
                </button>
                <button
                  onClick={() => setActiveTab('timetable')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  My Class Timetable
                </button>
                <button
                  onClick={() => setActiveTab('finance')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  Tuition Statement
                </button>
              </>
            )}

            {role === 'parent' && (
              <>
                <button
                  onClick={() => setSelectedStudentForReportCard(activeStudent)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Official Academic Transcript
                </button>
                <button
                  onClick={() => setActiveTab('finance')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  Pay Tuition Fees ({studentBalance === 0 ? 'Settled' : formatCurrency(studentBalance)})
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Attendance Summary ({activeStudent.attendanceRate}%)
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Primary KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">Total Enrollment</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{totalStudentsCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Grades 9 - 12 Cohorts</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">Faculty & Scholars</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{faculty.length * 14}</div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">
            {ACADEMY_INFO.studentFacultyRatio} Ratio
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">Daily Attendance</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <CalendarCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{avgAttendance}%</div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">
            Exemplary Attendance Rate
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">Academy Mean GPA</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{avgGPA} / 4.0</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            {honorsStudents.length} Honors Scholars
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-medium">Tuition Collection</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{collectionRate}%</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            {formatCurrency(totalPaid)} Collected
          </div>
        </div>
      </div>

      {/* Main Split Grid: Today's Schedule & Academy Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (2 columns on large) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today's Class Schedule (Monday)</h3>
                <p className="text-xs text-slate-500">Live academic lecture slots & laboratory sessions</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('timetable')}
              className="text-xs text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>Full Week Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {timetable
              .filter(t => t.day === 'Monday')
              .map(slot => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50/40 hover:border-emerald-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center">
                      P{slot.periodNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{slot.courseName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {slot.courseCode}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Grade {slot.gradeLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {slot.timeSlot}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {slot.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-700 block">{slot.teacherName}</span>
                    <span className="text-[10px] text-emerald-700 font-medium">In Session / Scheduled</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Academy Bulletins & Notices */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">Academy Notices</h3>
            </div>
            <button
              onClick={() => setActiveTab('bulletin')}
              className="text-xs text-emerald-700 font-semibold hover:text-emerald-800 transition"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {announcements.slice(0, 3).map(item => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 transition text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.category === 'Urgent'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : item.category === 'Academic'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500">{item.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveTab('bulletin')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              Post or Review Academy Bulletin
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Honors Roll & High-Performing Scholars */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Mount Olive Academy Honors Roll</h3>
            </div>
            <p className="text-xs text-slate-500">Students maintaining cumulative GPA &gt;= 3.80</p>
          </div>

          <button
            onClick={() => setActiveTab('students')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Open Student Information System (SIS)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {honorsStudents.slice(0, 4).map(student => (
            <div
              key={student.id}
              className="p-4 rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 flex items-center gap-3.5 hover:shadow-xs transition"
            >
              <img
                src={student.avatarUrl}
                alt={student.firstName}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600/30"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {student.firstName} {student.lastName}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Grade {student.grade} • Sec {student.section}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    GPA {student.gpa.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500">{student.attendanceRate}% Attd</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentForModal(student)}
                className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                title="View Student File"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
