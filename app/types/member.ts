export interface Member {
  id: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dob?: string;
  avatar?: string;
  mid?: string;
  fid?: string;
  pids?: string[];
}