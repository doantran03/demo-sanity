export interface Member {
  id: string;
  fullname: string;
  gender: 'male' | 'female' | 'other';
  dob?: string;
  avatar?: string;
  mid?: string;
  fid?: string;
  pids?: string[];
}