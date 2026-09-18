import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import { AttendanceRecord } from '../types';
import {
  CalendarCheck2,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Calendar,
  BookOpen,
  Save,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { courses, students, attendance, saveAttendance, role } = useSchool();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'CRS-PHY401');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-18');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const enrolledStudents = useMemo(() => {
    return students.filter(s => s.courses?.includes(selectedCourseId));
  }, [students, selectedCourseId]);

  // Local state for this session's attendance sheet
  const [sheet, setSheet] = useState<Record<string, { status: 'Present' | 'Absent' | 'Tardy' | 'Excused'; remarks: string }>>({});

  // Sync state when course or date changes
  React.useEffect(() => {
    const initialSheet: Record<string, { status: 'Present' | 'Absent' | 'Tardy' | 'Excused'; remarks: string }> = {};
    enrolledStudents.forEach(student => {
      const record = attendance.find(
        a => a.date === selectedDate && a.courseId === selectedCourseId && a.studentId === student.id
      );
      if (record) {
        initialSheet[student.id] = { status: record.status, remarks: record.remarks || '' };
      } else {
        // Default to Present
        initialSheet[student.id] = { status: 'Present', remarks: '' };
      }
    });
    setSheet(initialSheet);
  }, [selectedCourseId, selectedDate, enrolledStudents, attendance]);

  const updateStatus = (studentId: string, status: 'Present' | 'Absent' | 'Tardy' | 'Excused') => {
    setSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const updateRemarks = (studentId: string, remarks: string) => {
    setSheet(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const markAllPresent = () => {
    const updated: Record<string, { status: 'Present' | 'Absent' | 'Tardy' | 'Excused'; remarks: string }> = {};
    enrolledStudents.forEach(s => {
      updated[s.id] = { status: 'Present', remarks: sheet[s.id]?.remarks || '' };
    });
    setSheet(updated);
  };

  const handleSave = () => {
    const records: AttendanceRecord[] = enrolledStudents.map(student => ({
      id: `ATT-${Date.now()}-${student.id}`,
      date: selectedDate,
      courseId: selectedCourseId,
      studentId: student.id,
      status: sheet[student.id]?.status || 'Present',
      remarks: sheet[student.id]?.remarks || undefined,
    }));

    saveAttendance(records);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  // Stats calculation
  const totalStudents = enrolledStudents.length;
  const presentCount = Object.values(sheet).filter(s => s.status === 'Present').length;
  const tardyCount = Object.values(sheet).filter(s => s.status === 'Tardy').length;
  const absentCount = Object.values(sheet).filter(s => s.status === 'Absent').length;
  const excusedCount = Object.values(sheet).filter(s => s.status === 'Excused').length;
  const attendanceRate =
    totalStudents > 0 ? Math.round(((presentCount + tardyCount) / totalStudents) * 100) : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-cinzel font-bold text-slate-900">
              Daily Attendance Register
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {attendanceRate}% In Attendance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mount Olive Academy official roll call record for state compliance and guardian notifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Course Selector */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={markAllPresent}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            Mark All Present
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Present</span>
            <span className="text-xl font-bold text-emerald-800">{presentCount}</span>
            <span className="text-[10px] text-slate-500 ml-1">of {totalStudents}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Tardy</span>
            <span className="text-xl font-bold text-amber-800">{tardyCount}</span>
            <span className="text-[10px] text-slate-500 ml-1">Late arrivals</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Absent</span>
            <span className="text-xl font-bold text-rose-800">{absentCount}</span>
            <span className="text-[10px] text-slate-500 ml-1">Unexcused</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Excused</span>
            <span className="text-xl font-bold text-blue-800">{excusedCount}</span>
            <span className="text-[10px] text-slate-500 ml-1">Medical/Parent</span>
          </div>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Scholar Details</th>
                <th className="py-3.5 px-4">Grade & Track</th>
                <th className="py-3.5 px-4">Attendance Status</th>
                <th className="py-3.5 px-4">Remarks & Infirmary Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrolledStudents.map(student => {
                const currentStatus = sheet[student.id]?.status || 'Present';
                const currentRemarks = sheet[student.id]?.remarks || '';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition">
                    {/* Scholar Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatarUrl}
                          alt={student.firstName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {student.firstName} {student.lastName}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">{student.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Grade & Track */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">Grade {student.grade}</span>
                      <span className="text-slate-400 text-[11px] block">Sec {student.section}</span>
                    </td>

                    {/* Interactive Status Pills */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateStatus(student.id, 'Present')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          onClick={() => updateStatus(student.id, 'Tardy')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                            currentStatus === 'Tardy'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Tardy</span>
                        </button>

                        <button
                          onClick={() => updateStatus(student.id, 'Absent')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>

                        <button
                          onClick={() => updateStatus(student.id, 'Excused')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                            currentStatus === 'Excused'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Excused</span>
                        </button>
                      </div>
                    </td>

                    {/* Remarks Input */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Add optional attendance note..."
                        value={currentRemarks}
                        onChange={e => updateRemarks(student.id, e.target.value)}
                        className="w-full max-w-sm px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showSavedToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs border border-emerald-500/40 z-50 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Attendance records saved to Mount Olive Academy register</span>
        </div>
      )}
    </div>
  );
};
