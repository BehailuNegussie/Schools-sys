import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import { calculateWeightedScore, getLetterAndGPA, exportToCSV } from '../utils/academicUtils';
import {
  GraduationCap,
  Download,
  Save,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
  Award,
  AlertCircle,
  Clock,
  BookOpen,
  Filter,
} from 'lucide-react';

export const GradebookView: React.FC = () => {
  const { courses, students, grades, updateGrade, addGrade, role } = useSchool();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'CRS-PHY401');
  const [selectedTerm, setSelectedTerm] = useState<string>('Fall 2026');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Local draft state for quick inputs before batch save
  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Students enrolled in this course
  const enrolledStudents = useMemo(() => {
    return students.filter(s => s.courses?.includes(selectedCourseId));
  }, [students, selectedCourseId]);

  // Combined grade data for enrolled students
  const gradebookRows = useMemo(() => {
    return enrolledStudents.map(student => {
      const existingGrade = grades.find(
        g => g.studentId === student.id && g.courseId === selectedCourseId && g.term === selectedTerm
      );

      if (existingGrade) {
        return {
          student,
          gradeId: existingGrade.id,
          homework: existingGrade.homeworkScore,
          midterm: existingGrade.midtermScore,
          finalExam: existingGrade.finalScore,
          participation: existingGrade.participationScore,
          notes: existingGrade.teacherNotes,
          weightedScore: calculateWeightedScore(
            existingGrade.homeworkScore,
            existingGrade.midtermScore,
            existingGrade.finalScore,
            existingGrade.participationScore
          ),
          letterGrade: existingGrade.letterGrade,
          gpaPoint: existingGrade.gpaPoint,
        };
      }

      // Default placeholder grade if not yet entered
      const defHw = 90;
      const defMid = 88;
      const defFin = 92;
      const defPart = 95;
      const weighted = calculateWeightedScore(defHw, defMid, defFin, defPart);
      const { letter, gpa } = getLetterAndGPA(weighted);

      return {
        student,
        gradeId: null,
        homework: defHw,
        midterm: defMid,
        finalExam: defFin,
        participation: defPart,
        notes: 'Consistent academic contribution.',
        weightedScore: weighted,
        letterGrade: letter,
        gpaPoint: gpa,
      };
    });
  }, [enrolledStudents, grades, selectedCourseId, selectedTerm]);

  // Analytics
  const classScores = gradebookRows.map(r => r.weightedScore);
  const classAvg =
    classScores.length > 0
      ? (classScores.reduce((a, b) => a + b, 0) / classScores.length).toFixed(1)
      : '0.0';
  const highestScore = classScores.length > 0 ? Math.max(...classScores) : 0;
  const passingCount = gradebookRows.filter(r => r.weightedScore >= 70).length;
  const passingRate =
    gradebookRows.length > 0 ? Math.round((passingCount / gradebookRows.length) * 100) : 100;

  const handleScoreChange = (
    studentId: string,
    field: 'homeworkScore' | 'midtermScore' | 'finalScore' | 'participationScore',
    value: number
  ) => {
    const clamped = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    const existing = grades.find(
      g => g.studentId === studentId && g.courseId === selectedCourseId && g.term === selectedTerm
    );

    if (existing) {
      updateGrade(existing.id, { [field]: clamped });
    } else {
      addGrade({
        studentId,
        courseId: selectedCourseId,
        term: selectedTerm,
        homeworkScore: field === 'homeworkScore' ? clamped : 90,
        midtermScore: field === 'midtermScore' ? clamped : 88,
        finalScore: field === 'finalScore' ? clamped : 92,
        participationScore: field === 'participationScore' ? clamped : 95,
        letterGrade: 'A',
        gpaPoint: 4.0,
        teacherNotes: 'Scores recorded.',
      });
    }

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    const existing = grades.find(
      g => g.studentId === studentId && g.courseId === selectedCourseId && g.term === selectedTerm
    );
    if (existing) {
      updateGrade(existing.id, { teacherNotes: notes });
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Student ID',
      'Student Name',
      'Grade Level',
      'Course',
      'Homework (20%)',
      'Midterm (30%)',
      'Final (40%)',
      'Participation (10%)',
      'Weighted Score',
      'Letter Grade',
      'GPA Points',
      'Teacher Notes',
    ];

    const rows = gradebookRows.map(r => [
      r.student.id,
      `${r.student.firstName} ${r.student.lastName}`,
      `Grade ${r.student.grade}`,
      currentCourse.title,
      r.homework,
      r.midterm,
      r.finalExam,
      r.participation,
      r.weightedScore,
      r.letterGrade,
      r.gpaPoint,
      r.notes,
    ]);

    exportToCSV(`${currentCourse.code}_Gradebook_${selectedTerm}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Gradebook Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-cinzel font-bold text-slate-900">
              Mount Olive Academic Gradebook
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {selectedTerm}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official evaluation registry with weighted assessment formulas, letter conversion, and honors calculation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Course Selector */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <select
              id="gradebook-course-select"
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

          {/* Term Selector */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <select
              id="gradebook-term-select"
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Fall 2026">Fall Semester 2026</option>
              <option value="Spring 2026">Spring Semester 2026</option>
            </select>
          </div>

          {/* Export CSV */}
          <button
            id="export-gradebook-csv-btn"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Course Meta Banner & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs md:col-span-1">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Lead Instructor
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-1">{currentCourse.teacherName}</h4>
          <span className="text-xs text-slate-500 block">{currentCourse.room} • {currentCourse.period}</span>
          <span className="inline-block mt-2 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            {currentCourse.credits} Academic Credits
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Class Mean Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{classAvg}%</div>
          <span className="text-[11px] text-emerald-700 font-medium">Weighted Composite</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Top Cohort Score</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{highestScore}%</div>
          <span className="text-[11px] text-amber-700 font-medium">Grade Point: 4.0</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium">Passing Rate</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{passingRate}%</div>
          <span className="text-[11px] text-teal-700 font-medium">{passingCount} of {gradebookRows.length} Enrolled</span>
        </div>
      </div>

      {/* Grade Calculation Legend */}
      <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Formula Weights:</span>
          <span>Homework: <strong>20%</strong></span>
          <span>•</span>
          <span>Midterm: <strong>30%</strong></span>
          <span>•</span>
          <span>Final Exam: <strong>40%</strong></span>
          <span>•</span>
          <span>Participation: <strong>10%</strong></span>
        </div>
        <div className="text-[11px] text-slate-500">
          * Editable cells: Type new scores directly to update live GPA
        </div>
      </div>

      {/* Main Gradebook Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Scholar & ID</th>
                <th className="py-3.5 px-3 text-center">HW (20%)</th>
                <th className="py-3.5 px-3 text-center">Midterm (30%)</th>
                <th className="py-3.5 px-3 text-center">Final (40%)</th>
                <th className="py-3.5 px-3 text-center">Part. (10%)</th>
                <th className="py-3.5 px-3 text-center">Total Score</th>
                <th className="py-3.5 px-3 text-center">Letter</th>
                <th className="py-3.5 px-3 text-center">GPA</th>
                <th className="py-3.5 px-4">Faculty Observations & Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gradebookRows.map(row => (
                <tr key={row.student.id} className="hover:bg-slate-50/60 transition">
                  {/* Scholar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={row.student.avatarUrl}
                        alt={row.student.firstName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {row.student.firstName} {row.student.lastName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{row.student.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Homework */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={row.homework}
                      onChange={e =>
                        handleScoreChange(row.student.id, 'homeworkScore', parseInt(e.target.value) || 0)
                      }
                      className="w-14 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </td>

                  {/* Midterm */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={row.midterm}
                      onChange={e =>
                        handleScoreChange(row.student.id, 'midtermScore', parseInt(e.target.value) || 0)
                      }
                      className="w-14 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </td>

                  {/* Final Exam */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={row.finalExam}
                      onChange={e =>
                        handleScoreChange(row.student.id, 'finalScore', parseInt(e.target.value) || 0)
                      }
                      className="w-14 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </td>

                  {/* Participation */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={row.participation}
                      onChange={e =>
                        handleScoreChange(row.student.id, 'participationScore', parseInt(e.target.value) || 0)
                      }
                      className="w-14 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </td>

                  {/* Weighted Score */}
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                    {row.weightedScore}%
                  </td>

                  {/* Letter Grade */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                        row.letterGrade.startsWith('A')
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.letterGrade.startsWith('B')
                          ? 'bg-blue-100 text-blue-800'
                          : row.letterGrade.startsWith('C')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {row.letterGrade}
                    </span>
                  </td>

                  {/* GPA Points */}
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                    {row.gpaPoint.toFixed(1)}
                  </td>

                  {/* Remarks */}
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.notes}
                      onChange={e => handleNotesChange(row.student.id, e.target.value)}
                      placeholder="Enter teacher observation..."
                      className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-700"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Saved feedback toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs border border-emerald-500/40 z-50 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Mount Olive Gradebook updated & saved</span>
        </div>
      )}
    </div>
  );
};
