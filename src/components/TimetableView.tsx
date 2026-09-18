import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  BookOpen,
  Filter,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const TimetableView: React.FC = () => {
  const { timetable, courses } = useSchool();
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

  const filteredSlots = timetable.filter(
    slot => selectedGrade === 'all' || slot.gradeLevel === selectedGrade
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-cinzel font-bold text-slate-900">
              Master Academic Timetable
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Fall Term 2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weekly departmental schedule, laboratory sessions, and Athenaeum colloquium hours.
          </p>
        </div>

        {/* Grade filter */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 px-2">Filter Grade:</span>
          {(['all', 9, 10, 11, 12] as const).map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                selectedGrade === g
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {g === 'all' ? 'All Cohorts' : `Grade ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* Bell Schedule Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Morning Assembly</span>
          <span className="font-bold text-slate-800 text-xs">08:00 - 08:25 AM</span>
          <span className="text-[10px] text-slate-500 block">Great Hall Chapel</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Period 1</span>
          <span className="font-bold text-slate-800 text-xs">08:30 - 09:45 AM</span>
          <span className="text-[10px] text-emerald-700 block">Core STEM & AP</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Period 2</span>
          <span className="font-bold text-slate-800 text-xs">10:00 - 11:15 AM</span>
          <span className="text-[10px] text-blue-700 block">Mathematics & Stats</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Lunch & Commons</span>
          <span className="font-bold text-slate-800 text-xs">12:00 - 01:15 PM</span>
          <span className="text-[10px] text-amber-700 block">Dining Pavilion</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Period 4 / Studio</span>
          <span className="font-bold text-slate-800 text-xs">01:30 - 02:45 PM</span>
          <span className="text-[10px] text-violet-700 block">Labs & Seminars</span>
        </div>
      </div>

      {/* Timetable Grid by Days */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map(day => {
          const daySlots = filteredSlots.filter(s => s.day === day);

          return (
            <div
              key={day}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-cinzel font-bold text-sm text-slate-900">{day}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  {daySlots.length} Classes
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {daySlots.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No scheduled lectures for selected filter
                  </div>
                ) : (
                  daySlots.map(slot => (
                    <div
                      key={slot.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/60 hover:border-emerald-300 hover:shadow-xs transition"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">
                          P{slot.periodNumber}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Grade {slot.gradeLevel}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                        {slot.courseName}
                      </h4>

                      <div className="space-y-1 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{slot.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{slot.room}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="text-slate-700 font-medium">{slot.teacherName}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
