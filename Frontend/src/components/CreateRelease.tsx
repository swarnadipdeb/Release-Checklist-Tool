import { useState } from 'react';
import { createRelease } from '../api/api';

interface Props {
  onCancel: () => void;
  onCreateSuccess: (id: number) => void;
}

export default function CreateRelease({ onCancel, onCreateSuccess }: Props) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;
    setCreating(true);
    setError(null);
    try {
      const released = await createRelease({ name: name.trim(), date, additionalInfo });
      onCreateSuccess(released.id);
    } catch (err: any) {
      setError(err.message || 'Failed to create release');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="text-sm text-brand hover:text-brand-hover mr-2">
          All releases
        </button>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-sm text-gray-700 font-medium">New release</span>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Release name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Version 2.0.0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Release date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional notes</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Optional notes for this release"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button
            type="submit"
            disabled={creating || !name.trim() || !date}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {creating ? 'Creating...' : 'Create release'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
