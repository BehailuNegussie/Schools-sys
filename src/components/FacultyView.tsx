import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Faculty } from '../types';
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  UserPlus,
  Search,
  X,
  GraduationCap,
} from 'lucide-react';

export const FacultyView: React.FC = () => {
  const { faculty, courses, addFaculty, role } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add faculty form
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    department: 'Natural Sciences' as Faculty['department'],
    email: '',
    phone: '+1 (555) 389-44',
    office: '',
    degrees: '',
    coursesAssigned: [] as string[],
    avatarUrl: '',
  });

  const departments = [
    'Natural Sciences',
    'Mathematics & Computing',
    'Humanities & Languages',
    'Fine Arts & Music',
    'Physical Education & Athletics',
  ];

  const filteredFaculty = useMemo(() => {
    return faculty.filter(f => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.office.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = deptFilter === 'all' || f.department === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [faculty, searchQuery, deptFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    addFaculty({
      ...formData,
      email: formData.email || `${formData.name.toLowerCase().replace(/[^a-z]/g, '.')}@mountolive.edu`,
      avatarUrl:
        formData.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    });

    setIsAddOpen(false);
    setFormData({
      name: '',
      title: '',
      department: 'Natural Sciences',
      email: '',
      phone: '+1 (555) 389-44',
      office: '',
      degrees: '',
      coursesAssigned: [],
      avatarUrl: '',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-cinzel font-bold text-slate-900">
              Mount Olive Faculty & Academic Staff
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {faculty.length} Distinguished Faculty
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Departmental chairs, instructors, and research mentors shaping scholars across five faculties.
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Faculty Member</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search faculty by name, title, or office..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-500 px-2 whitespace-nowrap">Department:</span>
          <button
            onClick={() => setDeptFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
              deptFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Faculties
          </button>
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                deptFilter === d
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {d.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFaculty.map(f => {
          const assignedCourses = courses.filter(c => f.coursesAssigned?.includes(c.id));

          return (
            <div
              key={f.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-4">
                  <img
                    src={f.avatarUrl}
                    alt={f.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600/30 shadow-xs shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{f.name}</h3>
                    <p className="text-xs text-emerald-800 font-semibold">{f.title}</p>
                    <span className="inline-block text-[10px] text-slate-500 font-medium mt-0.5">
                      {f.department}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3 text-xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Academic Background
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed italic">{f.degrees}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{f.office}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{f.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{f.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Assigned Lecture Courses
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {assignedCourses.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">Departmental Advisory</span>
                  ) : (
                    assignedCourses.map(c => (
                      <span
                        key={c.id}
                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        {c.code}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Faculty Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add Faculty Member</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Catherine Bennett"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Academic Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Lecturer in Chemistry"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {departments.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Office Location</label>
                <input
                  type="text"
                  placeholder="e.g. Science Hall 308"
                  value={formData.office}
                  onChange={e => setFormData({ ...formData, office: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Academic Credentials & Degrees</label>
                <input
                  type="text"
                  placeholder="e.g. Ph.D. in Chemistry (Harvard), B.S. (Princeton)"
                  value={formData.degrees}
                  onChange={e => setFormData({ ...formData, degrees: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-semibold"
                >
                  Add to Faculty Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
