import type { ReleaseStatus } from '../types/types';

interface StatusBadgeProps {
  status: ReleaseStatus;
}

const styles: Record<ReleaseStatus, string> = {
  PLANNED: 'bg-gray-100 text-gray-600',
  ONGOING: 'bg-amber-100 text-amber-700',
  DONE: 'bg-emerald-100 text-emerald-700',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status === 'PLANNED' ? 'Planned' : status === 'ONGOING' ? 'Ongoing' : 'Done'}
    </span>
  );
}
