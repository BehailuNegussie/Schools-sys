import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student, StudentStatus } from '../types';
import { ACADEMY_INFO } from '../data/seedData';
import {
  Search,
  UserPlus,
  Filter,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  FileText,
  CreditCard,
  Trash2,
  Edit2,
  X,
  Check,
  Printer,
  ChevronRight,
  ShieldAlert,
  Award,
  Layers,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    role,
    setSelectedStudentForModal,
    setSelectedStudentForReportCard,
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modal states
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);

  // Form State for Enrollment
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: 9,
    section: 'A',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '2011-05-15',
    email: '',
    phone: '+1 (555) ',
    address: 'Academy Valley, CA',
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '+1 (555) ',
    guardianRelation: 'Parent',
    status: 'Active' as StudentStatus,
    avatarUrl: '',
    emergencyContact: '',
    medicalNotes: '',
    courses: ['CRS-PHY401', 'CRS-MTH301'],
  });

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch =
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [students, searchQuery, gradeFilter, statusFilter]);

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) return;

    const email = formData.email || `${formData.firstName[0].toLowerCase()}.${formData.lastName.toLowerCase()}@student.mountolive.edu`;
    const avatar = formData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';

    addStudent({
      ...formData,
      email,
      avatarUrl: avatar,
    });

    setIsEnrollOpen(false);
    // Reset
    setFormData({
      firstName: '',
      lastName: '',
      grade: 9,
      section: 'A',
      gender: 'Male',
      dob: '2011-05-15',
      email: '',
      phone: '+1 (555) ',
      address: 'Academy Valley, CA',
      guardianName: '',
      guardianEmail: '',
      guardianPhone: '+1 (555) ',
      guardianRelation: 'Parent',
      status: 'Active',
      avatarUrl: '',
      emergencyContact: '',
      medicalNotes: '',
      courses: ['CRS-PHY401', 'CRS-MTH301'],
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent.id, editingStudent);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-cinzel font-bold text-slate-900">
              Student Information System (SIS)
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {students.length} Scholars Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse academic files, track cumulative GPAs, generate official transcripts, and manage admissions.
          </p>
        </div>

        {role === 'admin' && (
          <button
            id="open-enroll-modal-btn"
            onClick={() => setIsEnrollOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="student-search-input"
            type="text"
            placeholder="Search by student name, ID, guardian, or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Grade Filters */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 px-2">Grade:</span>
          {(['all', 9, 10, 11, 12] as const).map(g => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                gradeFilter === g
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {g === 'all' ? 'All' : `Gr. ${g}`}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 px-2">Status:</span>
          {(['all', 'Honors', 'Active', 'Probation'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                statusFilter === s
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Table View"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Grid Cards View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results view */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No Student Records Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms or grade filters.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3.5 px-4">Student & ID</th>
                  <th className="py-3.5 px-4">Grade & Section</th>
                  <th className="py-3.5 px-4">Academic Status</th>
                  <th className="py-3.5 px-4">Cumulative GPA</th>
                  <th className="py-3.5 px-4">Attendance</th>
                  <th className="py-3.5 px-4">Guardian Contact</th>
                  <th className="py-3.5 px-4 text-right">Academic Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/70 transition group"
                  >
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatarUrl}
                          alt={student.firstName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <button
                            onClick={() => setSelectedStudentForModal(student)}
                            className="font-bold text-slate-900 hover:text-emerald-700 transition text-left block"
                          >
                            {student.firstName} {student.lastName}
                          </button>
                          <span className="font-mono text-[10px] text-slate-400">{student.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Grade & Section */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">Grade {student.grade}</span>
                      <span className="text-slate-400 text-[11px] block">Section {student.section}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          student.status === 'Honors'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : student.status === 'Probation'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {student.status === 'Honors' && <Award className="w-3 h-3 text-amber-600" />}
                        {student.status === 'Probation' && <ShieldAlert className="w-3 h-3 text-rose-600" />}
                        {student.status}
                      </span>
                    </td>

                    {/* GPA */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono font-bold text-xs ${
                            student.gpa >= 3.8
                              ? 'text-emerald-700'
                              : student.gpa >= 3.0
                              ? 'text-slate-800'
                              : 'text-rose-600 font-extrabold'
                          }`}
                        >
                          {student.gpa.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400">/ 4.0</span>
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.attendanceRate >= 95
                                ? 'bg-emerald-500'
                                : student.attendanceRate >= 90
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${student.attendanceRate}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-slate-700">
                          {student.attendanceRate}%
                        </span>
                      </div>
                    </td>

                    {/* Guardian */}
                    <td className="py-3 px-4 text-[11px]">
                      <span className="text-slate-800 font-medium block truncate max-w-[150px]">
                        {student.guardianName}
                      </span>
                      <span className="text-slate-400 block truncate max-w-[150px]">{student.guardianEmail}</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudentForReportCard(student)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-semibold flex items-center gap-1 border border-slate-200 transition"
                          title="Generate Official Report Card"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Report Card</span>
                        </button>

                        <button
                          onClick={() => setIdCardStudent(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition"
                          title="View Student Academy ID"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>

                        {role === 'admin' && (
                          <>
                            <button
                              onClick={() => setEditingStudent(student)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition"
                              title="Edit Student Info"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Remove ${student.firstName} ${student.lastName} from the academy registry?`)) {
                                  deleteStudent(student.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatarUrl}
                      alt={student.firstName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
                    />
                    <div>
                      <h3
                        onClick={() => setSelectedStudentForModal(student)}
                        className="text-sm font-bold text-slate-900 hover:text-emerald-700 cursor-pointer"
                      >
                        {student.firstName} {student.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-slate-400">{student.id}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Gr.{student.grade} • Sec {student.section}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
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

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Cumulative GPA</span>
                    <span className="font-bold text-slate-800 text-sm">{student.gpa.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Attendance Rate</span>
                    <span className="font-bold text-emerald-700 text-sm">{student.attendanceRate}%</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <UserPlus className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">Guardian: {student.guardianName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedStudentForReportCard(student)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Report Card
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIdCardStudent(student)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Student Academy ID"
                  >
                    <CreditCard className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedStudentForModal(student)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                    title="Full Profile"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enroll Student Modal */}
      {isEnrollOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-cinzel font-bold text-slate-900">
                    Enroll New Scholar
                  </h3>
                  <p className="text-xs text-slate-500">Mount Olive Academy Admissions Register</p>
                </div>
              </div>

              <button
                onClick={() => setIsEnrollOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nicholas"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hawthorne"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grade Level</label>
                  <select
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value={9}>Grade 9 (Freshman)</option>
                    <option value={10}>Grade 10 (Sophomore)</option>
                    <option value={11}>Grade 11 (Junior)</option>
                    <option value={12}>Grade 12 (Senior)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="A">Section A (STEM Track)</option>
                    <option value="B">Section B (Humanities & Arts)</option>
                    <option value="C">Section C (General Honors)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Non-binary</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Guardian Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robert & Linda Hawthorne"
                    value={formData.guardianName}
                    onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Guardian Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. r.hawthorne@lawfirm.com"
                    value={formData.guardianEmail}
                    onChange={e => setFormData({ ...formData, guardianEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Medical / Dietary Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Peanut allergy, Asthma inhaler required, or None reported"
                  value={formData.medicalNotes}
                  onChange={e => setFormData({ ...formData, medicalNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEnrollOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-xs transition"
                >
                  Complete Enrollment & Assign ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Edit Scholar Record: {editingStudent.firstName} {editingStudent.lastName}
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={editingStudent.firstName}
                    onChange={e => setEditingStudent({ ...editingStudent, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editingStudent.lastName}
                    onChange={e => setEditingStudent({ ...editingStudent, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Academic Status</label>
                  <select
                    value={editingStudent.status}
                    onChange={e => setEditingStudent({ ...editingStudent, status: e.target.value as StudentStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Honors">Honors</option>
                    <option value="Active">Active</option>
                    <option value="Probation">Probation</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grade Level</label>
                  <select
                    value={editingStudent.grade}
                    onChange={e => setEditingStudent({ ...editingStudent, grade: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value={9}>Grade 9</option>
                    <option value={10}>Grade 10</option>
                    <option value={11}>Grade 11</option>
                    <option value={12}>Grade 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Emergency / Guardian Contact</label>
                <input
                  type="text"
                  value={editingStudent.guardianName}
                  onChange={e => setEditingStudent({ ...editingStudent, guardianName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-semibold"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Student Academy ID Card Modal */}
      {idCardStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 text-white border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setIdCardStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge Card */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-950 rounded-2xl p-6 border-2 border-amber-400/30 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 border border-emerald-500/40 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-cinzel font-bold text-sm text-white tracking-wide">
                      Mount Olive Academy
                    </h4>
                    <span className="text-[9px] uppercase tracking-widest text-amber-400 font-medium">
                      Official Scholar Pass
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">2026-2027</span>
              </div>

              <div className="flex gap-4 items-center mb-5">
                <img
                  src={idCardStudent.avatarUrl}
                  alt={idCardStudent.firstName}
                  className="w-20 h-24 rounded-xl object-cover border-2 border-emerald-500/60 shadow-md"
                />
                <div className="space-y-1 text-xs">
                  <h3 className="font-bold text-base text-white">
                    {idCardStudent.firstName} {idCardStudent.lastName}
                  </h3>
                  <p className="font-mono text-emerald-400 font-semibold">{idCardStudent.id}</p>
                  <p className="text-slate-300">
                    Grade {idCardStudent.grade} • Section {idCardStudent.section}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${
                      idCardStudent.status === 'Honors'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-emerald-400/20 text-emerald-300'
                    }`}
                  >
                    {idCardStudent.status} Scholar
                  </span>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="bg-white p-2.5 rounded-xl text-slate-900 flex flex-col items-center justify-center">
                <div className="flex items-center space-x-1 h-8 w-full justify-center">
                  {[4, 2, 6, 1, 5, 2, 7, 3, 2, 5, 1, 6, 3, 4, 2, 7, 2, 5, 3, 6, 2, 4, 1].map((w, i) => (
                    <div
                      key={i}
                      className="bg-slate-900 h-full"
                      style={{ width: `${w * 2}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] tracking-widest text-slate-600 mt-1 font-bold">
                  *{idCardStudent.id}*
                </span>
              </div>

              <div className="mt-3 text-[10px] text-slate-400 text-center">
                Valid for Campus Entry, Athenaeum Library & Athletic Fieldhouse
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">Card Issued: Sep 2026</span>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Scholar ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
