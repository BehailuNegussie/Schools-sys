import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { ACADEMY_INFO } from '../data/seedData';
import { Role } from '../types';
import {
  GraduationCap,
  Search,
  Bell,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  BookOpen,
  UserCheck,
  Building2,
  X,
} from 'lucide-react';

export const AcademyHeader: React.FC = () => {
  const {
    role,
    setRole,
    students,
    activeStudentId,
    setActiveStudentId,
    faculty,
    activeTeacherId,
    setActiveTeacherId,
    announcements,
    setIsSearchOpen,
    resetToDefaultData,
  } = useSchool();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];
  const activeTeacher = faculty.find(f => f.id === activeTeacherId) || faculty[0];

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
  };

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top micro-bar: Motto, Date & Quick Meta */}
      <div className="bg-slate-950 px-4 lg:px-8 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="font-cinzel tracking-widest text-amber-400 font-semibold uppercase text-[11px]">
            {ACADEMY_INFO.motto}
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline italic text-slate-400">"{ACADEMY_INFO.mottoTranslation}"</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">Est. {ACADEMY_INFO.established}</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{ACADEMY_INFO.currentTerm}</span>
          </span>
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono text-[10px]">
            Campus Status: Normal Operations
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Academy Brand Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 border border-emerald-500/40 p-2 shadow-inner flex items-center justify-center relative">
            <GraduationCap className="w-6 h-6 text-emerald-300" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-950">
              A+
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-cinzel font-bold text-white tracking-wide">
                Mount Olive Academy
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-slate-800 text-emerald-400 rounded-md border border-slate-700">
                Independent Day & Boarding
              </span>
            </div>
            <p className="text-xs text-slate-400">Academic Management & Student Information System</p>
          </div>
        </div>

        {/* Center/Right controls: Search, Role Switcher, Notifications, Reset */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Trigger */}
          <button
            id="global-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs transition shadow-sm"
            title="Search students, faculty, courses (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Quick Search...</span>
            <kbd className="hidden lg:inline-block bg-slate-900 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Role Switcher Pill Container */}
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center">
            <span className="text-[11px] font-medium text-slate-400 px-2 hidden xl:inline">Role View:</span>
            <div className="flex items-center space-x-1">
              {(['admin', 'teacher', 'student', 'parent'] as Role[]).map(r => {
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    id={`role-btn-${r}`}
                    onClick={() => handleRoleChange(r)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {r === 'admin' && <Building2 className="w-3 h-3" />}
                    {r === 'teacher' && <BookOpen className="w-3 h-3" />}
                    {r === 'student' && <GraduationCap className="w-3 h-3" />}
                    {r === 'parent' && <UserCheck className="w-3 h-3" />}
                    <span>{r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic User Selector for Student or Teacher Role */}
          {role === 'student' && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400">Viewing as:</span>
              <select
                id="active-student-select"
                value={activeStudentId}
                onChange={e => setActiveStudentId(e.target.value)}
                className="bg-slate-900 text-emerald-300 text-xs rounded px-2 py-0.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} (Gr.{s.grade})
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === 'parent' && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400">Child:</span>
              <select
                id="active-parent-child-select"
                value={activeStudentId}
                onChange={e => setActiveStudentId(e.target.value)}
                className="bg-slate-900 text-amber-300 text-xs rounded px-2 py-0.5 border border-slate-700 focus:outline-none focus:border-amber-500"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} (Parent: {s.guardianName.split('&')[0].trim()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === 'teacher' && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400">Instructor:</span>
              <select
                id="active-teacher-select"
                value={activeTeacherId}
                onChange={e => setActiveTeacherId(e.target.value)}
                className="bg-slate-900 text-emerald-300 text-xs rounded px-2 py-0.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {faculty.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.department.split('&')[0].trim()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notifications dropdown trigger */}
          <div className="relative">
            <button
              id="notifications-toggle-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative transition"
              title="Academy Notices"
            >
              <Bell className="w-4 h-4" />
              {announcements.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">Academy Bulletins</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{announcements.length} active notices</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 px-2 py-1">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-2.5 hover:bg-slate-800/60 rounded-lg transition text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            ann.category === 'Urgent'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : ann.category === 'Academic'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}
                        >
                          {ann.category}
                        </span>
                        <span className="text-[10px] text-slate-500">{ann.date}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{ann.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data with confirmation */}
          <button
            id="reset-data-btn"
            onClick={() => setShowResetConfirm(true)}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition"
            title="Reset academy data to initial demo state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Reset Academy Database?</h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              This will restore all Mount Olive Academy records, student files, grades, and fee records to their default
              state.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg transition"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
