import React from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  X,
  GraduationCap,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  HeartPulse,
  User,
  BookOpen,
  FileText,
  CreditCard,
} from 'lucide-react';

export const StudentProfileModal: React.FC = () => {
  const {
    selectedStudentForModal,
    setSelectedStudentForModal,
    setSelectedStudentForReportCard,
    courses,
  } = useSchool();

  if (!selectedStudentForModal) return null;

  const student = selectedStudentForModal;
  const enrolledCourses = courses.filter(c => student.courses?.includes(c.id));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={() => setSelectedStudentForModal(null)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile Section */}
        <div className="flex items-start gap-4 pb-5 border-b border-slate-100 mb-5">
          <img
            src={student.avatarUrl}
            alt={student.firstName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600/30 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                {student.firstName} {student.lastName}
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  student.status === 'Honors'
                    ? 'bg-amber-100 text-amber-800'
                    : student.status === 'Probation'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {student.status}
              </span>
            </div>

            <p className="font-mono text-xs text-slate-400 mt-0.5">{student.id}</p>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Grade {student.grade} • Section {student.section} • Enrolled {student.enrollmentDate}
            </p>
          </div>
        </div>

        {/* Academic Stats Tiles */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider block">
              Cumulative GPA
            </span>
            <span className="text-xl font-bold text-emerald-950">{student.gpa.toFixed(2)} / 4.00</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Attendance Record
            </span>
            <span className="text-xl font-bold text-slate-900">{student.attendanceRate}%</span>
          </div>
        </div>

        {/* Personal & Guardian Info */}
        <div className="space-y-3 text-xs mb-5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Guardian & Emergency
            </span>
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-500">Guardian Name:</span>
              <span className="font-semibold text-slate-900">{student.guardianName}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-500">Contact Phone:</span>
              <span>{student.guardianPhone}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-500">Email:</span>
              <span>{student.guardianEmail}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-slate-500">Emergency:</span>
              <span className="text-emerald-700 font-medium">{student.emergencyContact}</span>
            </div>
          </div>

          {/* Medical Notes */}
          <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 flex items-start gap-2.5 text-xs text-rose-900">
            <HeartPulse className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[11px]">Infirmary & Health Advisory:</span>
              <p className="text-[11px] text-rose-800 mt-0.5">
                {student.medicalNotes || 'No health flags or dietary restrictions documented.'}
              </p>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Enrolled Courses ({enrolledCourses.length})
            </span>
            <div className="space-y-1.5">
              {enrolledCourses.map(c => (
                <div
                  key={c.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{c.title}</span>
                    <span className="text-[10px] text-slate-500">
                      {c.code} • {c.teacherName} • {c.room}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {c.credits} Credits
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={() => {
              setSelectedStudentForReportCard(student);
              setSelectedStudentForModal(null);
            }}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Official Report Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
