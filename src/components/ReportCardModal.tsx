import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { ACADEMY_INFO } from '../data/seedData';
import { calculateWeightedScore } from '../utils/academicUtils';
import {
  GraduationCap,
  Printer,
  X,
  Award,
  CheckCircle2,
  Calendar,
  User,
  Shield,
} from 'lucide-react';

export const ReportCardModal: React.FC = () => {
  const {
    selectedStudentForReportCard,
    setSelectedStudentForReportCard,
    courses,
    grades,
    faculty,
  } = useSchool();

  if (!selectedStudentForReportCard) return null;

  const student = selectedStudentForReportCard;

  // Student's enrolled courses
  const studentCourses = courses.filter(c => student.courses?.includes(c.id));

  // Compute grades for this student
  const studentGrades = studentCourses.map(c => {
    const grade = grades.find(g => g.studentId === student.id && g.courseId === c.id);
    if (grade) {
      return {
        course: c,
        homework: grade.homeworkScore,
        midterm: grade.midtermScore,
        finalExam: grade.finalScore,
        participation: grade.participationScore,
        weightedScore: calculateWeightedScore(
          grade.homeworkScore,
          grade.midtermScore,
          grade.finalScore,
          grade.participationScore
        ),
        letter: grade.letterGrade,
        gpa: grade.gpaPoint,
        notes: grade.teacherNotes,
      };
    }

    // Default Fall standard
    return {
      course: c,
      homework: 92,
      midterm: 90,
      finalExam: 94,
      participation: 95,
      weightedScore: 92.5,
      letter: 'A',
      gpa: 4.0,
      notes: 'Demonstrates exemplary scholarship.',
    };
  });

  const totalCredits = studentCourses.reduce((acc, c) => acc + c.credits, 0);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-slate-300 relative my-8 print:p-0 print:border-none print:shadow-none">
        {/* Action controls (hidden on print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>Official Mount Olive Academy Academic Record</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Transcript / PDF</span>
            </button>
            <button
              onClick={() => setSelectedStudentForReportCard(null)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Printable Document Layout */}
        <div className="border-4 border-double border-slate-800 p-8 rounded-2xl bg-gradient-to-b from-white via-slate-50/20 to-white relative">
          {/* Academy Crest & Seal Header */}
          <div className="text-center pb-6 border-b-2 border-slate-800">
            <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-slate-900 border-2 border-amber-500/80 flex items-center justify-center text-emerald-400 shadow-md">
              <GraduationCap className="w-8 h-8 text-amber-400" />
            </div>

            <h1 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest text-slate-950 uppercase">
              {ACADEMY_INFO.name}
            </h1>

            <p className="font-cinzel text-xs tracking-widest text-amber-800 uppercase font-semibold mt-1">
              {ACADEMY_INFO.motto}
            </p>

            <p className="text-[11px] text-slate-500 mt-1 italic">
              {ACADEMY_INFO.address} • Tel: {ACADEMY_INFO.phone}
            </p>

            <div className="mt-3 inline-block bg-slate-900 text-amber-300 font-cinzel text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              Official Term Academic Report Card • {ACADEMY_INFO.currentTerm}
            </div>
          </div>

          {/* Scholar Meta Data Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-300 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Scholar</span>
              <span className="font-bold text-slate-900 text-sm">
                {student.firstName} {student.lastName}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Student ID Number</span>
              <span className="font-mono font-bold text-slate-800 text-xs">{student.id}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Grade & Section</span>
              <span className="font-bold text-slate-900 text-xs">
                Grade {student.grade} (Cohort Section {student.section})
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Standing</span>
              <span className="font-bold text-emerald-800 text-xs">{student.status} Scholar</span>
            </div>
          </div>

          {/* Grades Table */}
          <div className="py-5">
            <h3 className="text-xs uppercase font-cinzel font-bold text-slate-800 tracking-wider mb-3">
              Course Performance & Credit Accrual
            </h3>

            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3 border-r border-slate-300">Course & Code</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">HW (20%)</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">Mid (30%)</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">Fin (40%)</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">Score</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">Grade</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-300">GPA</th>
                  <th className="py-2.5 px-2 text-center">Credits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentGrades.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 border-r border-slate-300">
                      <span className="font-bold text-slate-900 block">{entry.course.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {entry.course.code} • {entry.course.teacherName}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center font-mono border-r border-slate-300">
                      {entry.homework}
                    </td>
                    <td className="py-2 px-2 text-center font-mono border-r border-slate-300">
                      {entry.midterm}
                    </td>
                    <td className="py-2 px-2 text-center font-mono border-r border-slate-300">
                      {entry.finalExam}
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold border-r border-slate-300 text-slate-900">
                      {entry.weightedScore}%
                    </td>
                    <td className="py-2 px-2 text-center font-bold border-r border-slate-300 text-emerald-800">
                      {entry.letter}
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold border-r border-slate-300">
                      {entry.gpa.toFixed(1)}
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold">
                      {entry.course.credits.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Academic Standing Summary Banner */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-100 rounded-xl border border-slate-300 text-center mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Cumulative GPA</span>
              <span className="text-base font-bold text-slate-900">{student.gpa.toFixed(2)} / 4.00</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Credits Earned</span>
              <span className="text-base font-bold text-slate-900">{totalCredits.toFixed(1)} Credits</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Attendance Rate</span>
              <span className="text-base font-bold text-emerald-800">{student.attendanceRate}%</span>
            </div>
          </div>

          {/* Institutional Signatures & Embossed Seal */}
          <div className="pt-6 border-t-2 border-slate-800 flex items-end justify-between text-xs">
            <div className="space-y-1 text-left">
              <div className="w-40 border-b border-slate-600 mb-1" />
              <span className="font-bold text-slate-900 block">{ACADEMY_INFO.principal}</span>
              <span className="text-[11px] text-slate-500">Headmaster & Principal</span>
            </div>

            {/* Simulated Gold Academy Seal */}
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-amber-600 bg-amber-50 flex flex-col items-center justify-center p-1 text-center shadow-xs">
              <Shield className="w-5 h-5 text-amber-700 mb-0.5" />
              <span className="font-cinzel text-[7px] font-bold text-amber-900 leading-tight uppercase">
                Mount Olive Official Seal
              </span>
            </div>

            <div className="space-y-1 text-right">
              <div className="w-40 border-b border-slate-600 mb-1 ml-auto" />
              <span className="font-bold text-slate-900 block">Office of the Registrar</span>
              <span className="text-[11px] text-slate-500">Issued: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
