import React from 'react';
import { useSchool } from '../context/SchoolContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck2,
  CalendarDays,
  Building,
  CreditCard,
  BellRing,
} from 'lucide-react';

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, students, invoices, announcements, role } = useSchool();

  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;
  const probationCount = students.filter(s => s.status === 'Probation').length;

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'students',
      label: 'Students (SIS)',
      icon: Users,
      badge: probationCount > 0 && role === 'admin' ? `${probationCount} Alert` : null,
      badgeType: 'warning',
    },
    {
      id: 'gradebook',
      label: 'Gradebook',
      icon: GraduationCap,
      badge: null,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarCheck2,
      badge: null,
    },
    {
      id: 'timetable',
      label: 'Schedule',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'faculty',
      label: 'Faculty & Staff',
      icon: Building,
      badge: null,
    },
    {
      id: 'finance',
      label: 'Finance & Tuition',
      icon: CreditCard,
      badge: overdueCount > 0 && (role === 'admin' || role === 'parent') ? `${overdueCount} Dues` : null,
      badgeType: 'danger',
    },
    {
      id: 'bulletin',
      label: 'Bulletin',
      icon: BellRing,
      badge: announcements.length > 0 ? `${announcements.length}` : null,
      badgeType: 'neutral',
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-4 lg:px-8 shadow-xs overflow-x-auto scrollbar-none">
      <div className="flex items-center space-x-1 min-w-max py-1.5">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition relative whitespace-nowrap ${
                isActive
                  ? 'text-emerald-800 bg-emerald-50/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>{tab.label}</span>

              {tab.badge && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    tab.badgeType === 'danger'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : tab.badgeType === 'warning'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
