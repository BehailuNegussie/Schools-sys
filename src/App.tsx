import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { AcademyHeader } from './components/AcademyHeader';
import { NavigationTabs } from './components/NavigationTabs';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { GradebookView } from './components/GradebookView';
import { AttendanceView } from './components/AttendanceView';
import { TimetableView } from './components/TimetableView';
import { FacultyView } from './components/FacultyView';
import { FinanceView } from './components/FinanceView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { ReportCardModal } from './components/ReportCardModal';
import { ACADEMY_INFO } from './data/seedData';
import { GraduationCap, Shield, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

const SchoolApp: React.FC = () => {
  const { activeTab } = useSchool();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Academy Top Header */}
      <AcademyHeader />

      {/* Primary Navigation Tabs */}
      <NavigationTabs />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'students' && <StudentsView />}
        {activeTab === 'gradebook' && <GradebookView />}
        {activeTab === 'attendance' && <AttendanceView />}
        {activeTab === 'timetable' && <TimetableView />}
        {activeTab === 'faculty' && <FacultyView />}
        {activeTab === 'finance' && <FinanceView />}
        {activeTab === 'bulletin' && <AnnouncementsView />}
      </main>

      {/* Global Modals */}
      <GlobalSearchModal />
      <StudentProfileModal />
      <ReportCardModal />

      {/* Institutional Academy Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-cinzel font-bold text-white tracking-wider">
                Mount Olive Academy
              </h3>
              <p className="text-[11px] text-slate-400">
                {ACADEMY_INFO.motto} • Accredited Independent College Preparatory School
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Academy Valley Campus</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{ACADEMY_INFO.phone}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{ACADEMY_INFO.email}</span>
            </span>
          </div>

          <div className="text-right text-xs">
            <p className="text-slate-300 font-medium">Headmaster: {ACADEMY_INFO.principal}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Mount Olive Academy Information System • {ACADEMY_INFO.academicYear}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <SchoolApp />
    </SchoolProvider>
  );
}
