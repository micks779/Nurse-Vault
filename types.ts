
export enum DocCategory {
  ID_RIGHT_TO_WORK = 'ID & Right to Work',
  NMC_REGISTRATION = 'NMC Registration',
  DBS_CHECKS = 'DBS & Background',
  QUALIFICATIONS = 'Qualifications',
  MANDATORY_TRAINING = 'Mandatory Training',
  IMMUNISATIONS = 'Immunisations',
  CV_REFERENCES = 'CV & References',
  OTHER = 'Other'
}

export enum TrainingStatus {
  VALID = 'Valid',
  DUE_SOON = 'Due Soon',
  EXPIRED = 'Expired'
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  category: DocCategory;
  uploadDate: string;
  expiryDate?: string;
  fileType: 'pdf' | 'jpg' | 'png';
  size: string;
  tags: string[];
}

export interface TrainingRecord {
  id: string;
  courseName: string;
  provider: string;
  dateCompleted: string;
  expiryDate?: string; // Made optional
  category: string;
  status: TrainingStatus;
  linkedDocId?: string;
}

export interface CPDEntry {
  id: string;
  title: string;
  date: string;
  hours: number;
  participatory: boolean;
  reflection: string;
  category: string;
  tags: string[];
  evidenceUrl?: string;
}

export interface Competency {
  id: string;
  skillName: string;
  category: 'Clinical' | 'Leadership' | 'Communication' | 'Digital' | 'Other';
  dateAssessed?: string;
  assessorName?: string;
  assessorRole?: string;
  status: 'Signed Off' | 'In Progress' | 'Not Started';
  setting?: string; // e.g., Ward 4, Community, Sim Lab
  notes?: string;
  evidenceVoiceLogId?: string; // Link to a voice note
}

export interface CareerRequirement {
  id: string;
  title: string;
  type: 'Qualification' | 'Experience' | 'Competency' | 'CPD';
  status: 'Not Started' | 'In Progress' | 'Done';
  description: string;
}

export interface CareerPath {
  id: string;
  currentBand: string;
  targetBand: string;
  specialty: string;
  currentSalary?: number;
  targetSalary?: number;
  requirements: CareerRequirement[];
}

export interface UserProfile {
  name: string;
  currentRole: string;
  currentBand: string;
  nmcPin: string;
  revalidationDate: string;
}

// New Types for Learning & Development
export interface VoiceLog {
  id: string;
  date: string;
  durationSeconds: number;
  title?: string;
  transcription: string;
  status: 'Draft' | 'Processed';
  suggestedType?: 'CPD' | 'Reflection' | 'Competency';
}

export interface Reflection {
  id: string;
  date: string;
  title: string;
  content: string; // The structured reflective piece (legacy - for backwards compatibility)
  // NMC Revalidation Format (4 questions)
  nmcQuestion1?: string; // "What was the nature of the CPD activity and/or practice-related feedback and/or event or experience in your practice?"
  nmcQuestion2?: string; // "What did you learn from the CPD activity and/or feedback and/or event or experience in your practice?"
  nmcQuestion3?: string; // "How did you change or improve your practice as a result?"
  nmcQuestion4?: string; // "How is this relevant to the Code?"
  codeThemes?: string[]; // Selected Code themes: 'Prioritise people', 'Practise effectively', 'Preserve safety', 'Promote professionalism and trust'
  tags: string[];
  method: 'Written' | 'Voice';
}

export interface Recommendation {
  id: string;
  title: string;
  type: 'Course' | 'Module' | 'Activity';
  reason: string; 
  status: 'Pending' | 'Completed';
  provider?: string;
  estimatedHours?: number;
}
