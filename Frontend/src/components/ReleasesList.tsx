import { useState } from 'react';
import type { Release } from '../types/types';
import { getReleases, deleteRelease } from '../api/api';
import StatusBadge from './StatusBadge';

interface Props {
  onCreateNew: () => void;
  onViewDetail: (id: number) => void;
  onRefresh: () => void;
}

export default function ReleasesList({ onCreateNew, onViewDetail, onRefresh }: Props) {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReleases();
      setReleases(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load releases');
    } finally {
      setLoading(false);
    }
  };

  useState(() => load());

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this release?')) return;
    try {
      await deleteRelease(id);
      load();
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      // Handle both "YYYY-MM-DD" and full datetime strings
      const d = dateStr.startsWith('20') ? new Date(dateStr + 'T00:00:00') : new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <nav className="text-sm text-gray-500">
          <span className="text-gray-400">/</span> <span className="text-gray-700 font-medium">All releases</span>
        </nav>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand hover:bg-brand-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New release
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading releases...</div>
      ) : releases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No releases yet</p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create your first release
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Release</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">View</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {releases.map((release) => (
                <tr key={release.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{release.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(release.date)}</td>
                  <td className="px-6 py-4"><StatusBadge status={release.status} /></td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onViewDetail(release.id)}
                      className="text-sm text-brand hover:text-brand-hover font-medium"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => handleDelete(e, release.id)}
                      className="inline-flex items-center gap-1 text-sm text-danger hover:text-danger-hover font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
