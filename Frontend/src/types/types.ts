export type ReleaseStatus = 'PLANNED' | 'ONGOING' | 'DONE';

export interface Release {
  id: number;
  name: string;
  date: string;
  status: ReleaseStatus;
  additionalInfo: string | null;
  completedSteps: number;
  createdAt: string;
  updatedAt: string;
}

export const CHECKLIST_STEPS = [
  'All relevant GitHub pull requests have been merged',
  'CHANGELOG.md file has been updated',
  'All tests are passing',
  'Release in GitHub created',
  'Deployed in demo',
  'Tested thoroughly in demo',
  'Deployed in production',
] as const;
