import { useState, useEffect } from 'react';
import type { Release } from '../types/types';
import { CHECKLIST_STEPS } from '../types/types';
import { getRelease, updateRelease, toggleStep } from '../api/api';
import StatusBadge from './StatusBadge';

interface Props {
  releaseId: number;
  onBack: () => void;
}

function isStepCompleted(completedSteps: number, index: number) {
  return (completedSteps & (1 << index)) !== 0;
}

export default function ReleaseDetail({ releaseId, onBack }: Props) {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRelease(releaseId);
      setRelease(data);
      setName(data.name);
      setDate(data.date.startsWith('20') ? data.date.slice(0, 10) : new Date(data.date).toISOString().slice(0, 10));
      setAdditionalInfo(data.additionalInfo || '');
    } catch (e: any) {
      setError(e.message || 'Failed to load release');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [releaseId]);

  const handleToggleStep = async (stepIndex: number) => {
    if (!release) return;
    try {
      const updated = await toggleStep(releaseId, stepIndex);
      setRelease(updated);
    } catch (e: any) {
      setError(e.message || 'Failed to toggle step');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateRelease(releaseId, { name, date, additionalInfo });
      setRelease(updated);
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;
  if (!release) return <div className="text-center py-12 text-gray-500">Release not found</div>;

  const completedCount = CHECKLIST_STEPS.filter((_, i) => isStepCompleted(release.completedSteps, i)).length;
  const progressPercent = Math.round((completedCount / CHECKLIST_STEPS.length) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <nav className="text-sm text-gray-500">
          <button onClick={onBack} className="text-brand hover:text-brand-hover">All releases</button>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-gray-700 font-medium">{release.name}</span>
        </nav>
        <StatusBadge status={release.status} />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{completedCount} / {CHECKLIST_STEPS.length} steps ({progressPercent}%)</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Release info + checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Release info card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Release info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Checklist</h2>
            <ul className="space-y-1">
              {CHECKLIST_STEPS.map((step, index) => {
                const checked = isStepCompleted(release.completedSteps, index);
                return (
                  <li key={index}>
                    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="mt-0.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleStep(index)}
                          className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand/30 cursor-pointer"
                        />
                      </div>
                      <span className={`text-sm leading-relaxed ${checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {step}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right: Notes + save */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Notes</h2>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Please enter any other important notes for the release"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
