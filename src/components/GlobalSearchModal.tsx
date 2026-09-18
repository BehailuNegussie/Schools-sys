import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  Search,
  X,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  BellRing,
  ChevronRight,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    students,
    faculty,
    courses,
    announcements,
    setSelectedStudentForModal,
    setActiveTab,
  } = useSchool();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredStudents = query.trim()
    ? students.filter(
        s =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
          s.id.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredFaculty = query.trim()
    ? faculty.filter(
        f =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.department.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredCourses = query.trim()
    ? courses.filter(
        c =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.code.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredAnnouncements = query.trim()
    ? announcements.filter(
        a =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.content.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hasResults =
    filteredStudents.length > 0 ||
    filteredFaculty.length > 0 ||
    filteredCourses.length > 0 ||
    filteredAnnouncements.length > 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a student name, faculty, course code, or bulletin topic..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>Quick navigation across Mount Olive Academy records.</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching "Physics", "Julian", "Marcus", or "Convocation".</p>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-slate-400">
              <p>No matches found for "{query}".</p>
            </div>
          ) : (
            <>
              {/* Students results */}
              {filteredStudents.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                    Enrolled Scholars ({filteredStudents.length})
                  </span>
                  <div className="space-y-1">
                    {filteredStudents.map(student => (
                      <button
                        key={student.id}
                        onClick={() => {
                          setSelectedStudentForModal(student);
                          setIsSearchOpen(false);
                        }}
                        className="w-full p-2 hover:bg-slate-50 rounded-xl flex items-center justify-between text-left transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatarUrl}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {student.id} • Grade {student.grade}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-700 font-bold">
                          GPA {student.gpa.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Faculty results */}
              {filteredFaculty.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                    Faculty & Instructors ({filteredFaculty.length})
                  </span>
                  <div className="space-y-1">
                    {filteredFaculty.map(f => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setActiveTab('faculty');
                          setIsSearchOpen(false);
                        }}
                        className="w-full p-2 hover:bg-slate-50 rounded-xl flex items-center justify-between text-left transition"
                      >
                        <div className="flex items-center gap-3">
                          <img src={f.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{f.name}</span>
                            <span className="text-[10px] text-slate-400">{f.title}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Course results */}
              {filteredCourses.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                    Courses ({filteredCourses.length})
                  </span>
                  <div className="space-y-1">
                    {filteredCourses.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveTab('timetable');
                          setIsSearchOpen(false);
                        }}
                        className="w-full p-2 hover:bg-slate-50 rounded-xl flex items-center justify-between text-left transition"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">{c.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{c.code} • {c.room}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          {c.credits} Credits
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Announcements */}
              {filteredAnnouncements.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                    Bulletins & Directives ({filteredAnnouncements.length})
                  </span>
                  <div className="space-y-1">
                    {filteredAnnouncements.map(a => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setActiveTab('bulletin');
                          setIsSearchOpen(false);
                        }}
                        className="w-full p-2 hover:bg-slate-50 rounded-xl flex items-center justify-between text-left transition"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block truncate">{a.title}</span>
                          <span className="text-[10px] text-slate-400">{a.category} • {a.date}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
