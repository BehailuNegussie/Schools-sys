import React, { useState, useMemo } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Announcement } from '../types';
import { formatDate } from '../utils/academicUtils';
import {
  Megaphone,
  Pin,
  Plus,
  Trash2,
  Filter,
  X,
  Calendar,
  User,
  AlertCircle,
  Award,
  BookOpen,
  Bell,
} from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, role } = useSchool();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isPostOpen, setIsPostOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Academic' as Announcement['category'],
    targetAudience: 'All' as Announcement['targetAudience'],
    author: 'Office of Academic Affairs',
    pinned: false,
  });

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(a => {
      if (categoryFilter === 'all') return true;
      return a.category === categoryFilter;
    });
  }, [announcements, categoryFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    addAnnouncement(formData);
    setIsPostOpen(false);
    setFormData({
      title: '',
      content: '',
      category: 'Academic',
      targetAudience: 'All',
      author: 'Office of Academic Affairs',
      pinned: false,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-cinzel font-bold text-slate-900">
              Mount Olive Academy Bulletin Board
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {announcements.length} Official Bulletins
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official announcements, convocation dispatches, examination notices, and collegiate updates.
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setIsPostOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Academy Notice</span>
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs overflow-x-auto">
        <span className="text-[11px] font-semibold text-slate-500 px-2 whitespace-nowrap">Filter By:</span>
        {(['all', 'Academic', 'Administrative', 'Sports & Arts', 'Urgent'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
              categoryFilter === cat
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat === 'all' ? 'All Bulletins' : cat}
          </button>
        ))}
      </div>

      {/* Bulletins Feed */}
      <div className="space-y-4">
        {filteredAnnouncements.map(ann => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl p-6 border shadow-xs transition relative ${
              ann.pinned ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                {ann.pinned && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <Pin className="w-3 h-3 text-amber-700 fill-amber-700" />
                    Pinned Directive
                  </span>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ann.category === 'Urgent'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : ann.category === 'Academic'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {ann.category}
                </span>

                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Target: {ann.targetAudience}
                </span>

                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {formatDate(ann.date)}
                </span>
              </div>

              {role === 'admin' && (
                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                  title="Remove Bulletin"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{ann.title}</h3>
            <p className="text-xs text-slate-700 leading-relaxed max-w-4xl whitespace-pre-line">
              {ann.content}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Dispatched by: {ann.author}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">MOA-BULLETIN-REF-{ann.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isPostOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Publish Academy Bulletin</h3>
              <button
                onClick={() => setIsPostOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule of Term 1 Final Examinations"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Sports & Arts">Sports & Arts</option>
                    <option value="Urgent">Urgent Notice</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={e => setFormData({ ...formData, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="All">All Academy Community</option>
                    <option value="Students">Students Only</option>
                    <option value="Parents">Parents & Guardians</option>
                    <option value="Faculty">Faculty & Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Issuing Department / Signatory</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Draft the official directive or announcement..."
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin-checkbox"
                  checked={formData.pinned}
                  onChange={e => setFormData({ ...formData, pinned: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="pin-checkbox" className="text-xs text-slate-700 font-medium">
                  Pin this bulletin to the top of the portal
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-xs"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
