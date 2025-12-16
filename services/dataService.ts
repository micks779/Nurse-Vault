
import { 
  Document, 
  TrainingRecord, 
  CPDEntry, 
  Competency, 
  UserProfile, 
  DocCategory, 
  TrainingStatus,
  CareerPath,
  CareerRequirement,
  VoiceLog,
  Reflection,
  Recommendation
} from '../types';
import { supabase } from '../lib/supabase';

// Initial Mock Data
const MOCK_PROFILE: UserProfile = {
  name: "Sarah Jenkins",
  currentRole: "Staff Nurse",
  currentBand: "Band 5",
  nmcPin: "12A3456E",
  revalidationDate: "2025-06-15"
};

const MOCK_DOCS: Document[] = [
  { id: '1', userId: 'u1', title: 'Passport Scan', category: DocCategory.ID_RIGHT_TO_WORK, uploadDate: '2023-01-15', expiryDate: '2030-01-15', fileType: 'jpg', size: '2.4MB', tags: ['Identity'] },
  { id: '2', userId: 'u1', title: 'NMC Statement of Entry', category: DocCategory.NMC_REGISTRATION, uploadDate: '2023-02-10', fileType: 'pdf', size: '150KB', tags: ['NMC'] },
  { id: '3', userId: 'u1', title: 'DBS Enhanced', category: DocCategory.DBS_CHECKS, uploadDate: '2024-01-05', expiryDate: '2025-01-05', fileType: 'pdf', size: '1.1MB', tags: ['DBS'] },
  { id: '4', userId: 'u1', title: 'BSc Nursing Degree', category: DocCategory.QUALIFICATIONS, uploadDate: '2020-07-20', fileType: 'pdf', size: '3.5MB', tags: ['Degree'] },
];

const MOCK_TRAINING: TrainingRecord[] = [
  { id: 't1', courseName: 'Basic Life Support (Level 2)', provider: 'NHS Trust', dateCompleted: '2023-10-10', expiryDate: '2024-10-10', category: 'Clinical', status: TrainingStatus.VALID },
  { id: 't2', courseName: 'Fire Safety', provider: 'E-Learning for Health', dateCompleted: '2023-05-15', expiryDate: '2024-05-15', category: 'Safety', status: TrainingStatus.DUE_SOON },
  { id: 't3', courseName: 'Information Governance', provider: 'Trust Logic', dateCompleted: '2022-04-01', expiryDate: '2023-04-01', category: 'Compliance', status: TrainingStatus.EXPIRED },
  { id: 't4', courseName: 'Infection Control (Level 2)', provider: 'NHS Trust', dateCompleted: '2024-01-20', expiryDate: '2025-01-20', category: 'Clinical', status: TrainingStatus.VALID },
];

const MOCK_CPD: CPDEntry[] = [
  { id: 'c1', title: 'Wound Care Conference', date: '2024-02-15', hours: 6, participatory: true, reflection: 'Learned about new negative pressure therapies.', category: 'Clinical', tags: ['Wound Care', 'Tissue Viability'] },
  { id: 'c2', title: 'Diabetes Management Module', date: '2024-01-10', hours: 4, participatory: false, reflection: 'Refreshed knowledge on insulin titration.', category: 'Clinical', tags: ['Diabetes', 'Meds'] },
];

const MOCK_COMPETENCIES: Competency[] = [
  { 
    id: 'comp1', 
    skillName: 'Venepuncture', 
    category: 'Clinical',
    dateAssessed: '2023-11-05', 
    assessorName: 'Sr. Mary Jones', 
    assessorRole: 'Band 7 Lead', 
    status: 'Signed Off', 
    setting: 'Acute Medical Ward',
    notes: 'Excellent technique shown during stressful admission.' 
  },
  { 
    id: 'comp2', 
    skillName: 'Male Catheterisation', 
    category: 'Clinical',
    dateAssessed: '2024-03-01', 
    assessorName: 'Dr. A. Smith', 
    assessorRole: 'Registrar', 
    status: 'In Progress', 
    setting: 'A&E',
    notes: 'Needs 2 more supervised practices to ensure sterility protocol is perfect.' 
  },
  {
    id: 'comp3',
    skillName: 'Shift Leadership',
    category: 'Leadership',
    status: 'Not Started',
    notes: 'Required for Band 6 progression.'
  }
];

const MOCK_PATHWAY: CareerPath = {
  id: 'path1',
  currentBand: 'Band 5',
  targetBand: 'Band 6',
  specialty: 'Acute Medicine',
  requirements: [
    { id: 'r1', title: 'Mentorship Qualification (SLAiP)', type: 'Qualification', status: 'In Progress', description: 'Required to mentor students.' },
    { id: 'r2', title: 'ALS (Advanced Life Support)', type: 'Qualification', status: 'Not Started', description: 'Mandatory for Band 6 in Acute.' },
    { id: 'r3', title: '6 Months Ward Management Experience', type: 'Experience', status: 'In Progress', description: 'Acting as shift coordinator.' },
    { id: 'r4', title: 'Intravenous Drug Admin Competency', type: 'Competency', status: 'Done', description: 'Full sign off required.' },
  ]
};

const MOCK_REFLECTIONS: Reflection[] = [
  { id: 'ref1', date: '2024-03-01', title: 'Managing a difficult relative', content: 'Situation: A relative was aggressive... \nAction: I used de-escalation techniques... \nOutcome: The relative calmed down.', tags: ['Communication', 'Leadership'], method: 'Written' }
];

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: 'rec1', title: 'Conflict Resolution Workshop', type: 'Course', reason: 'Recommended based on your recent reflection on difficult relatives.', status: 'Pending', provider: 'NHS Leadership Academy', estimatedHours: 4 },
  { id: 'rec2', title: 'SLAiP Module 2', type: 'Module', reason: 'Required for your Band 6 progression.', status: 'Pending', provider: 'University', estimatedHours: 20 }
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dataService = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        return {
          name: data.name,
          currentRole: data["current_role"],
          currentBand: data["current_band"],
          nmcPin: data.nmc_pin || '',
          revalidationDate: data.revalidation_date || ''
        };
      }
      throw new Error('Profile not found');
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  },

  getDocuments: async (): Promise<Document[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }

      return (data || []).map((doc: any) => ({
        id: doc.id,
        userId: doc.user_id,
        title: doc.title,
        category: doc.category as DocCategory,
        uploadDate: doc.upload_date,
        expiryDate: doc.expiry_date || undefined,
        fileType: doc.file_type as 'pdf' | 'jpg' | 'png',
        size: doc.size || '0KB',
        tags: doc.tags || []
      }));
    } catch (error) {
      console.error('Error in getDocuments:', error);
      return [];
    }
  },

  addDocument: async (file: File, metadata: {
    title: string;
    category: DocCategory;
    expiryDate?: string;
    tags?: string[];
  }): Promise<Document> => {
    try {
      console.log('📤 Starting document upload...');
      console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Authentication failed. Please log in again.');
      }
      if (!user) {
        throw new Error('Not authenticated. Please log in.');
      }
      
      console.log('✅ User authenticated:', user.id);

      const fileType = file.type.includes('pdf') ? 'pdf' : 
                      file.type.includes('png') ? 'png' : 'jpg';
      
      const timestamp = Date.now();
      const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${user.id}/${timestamp}-${sanitizedFilename}`;

      console.log('📁 Uploading to storage path:', storagePath);
      console.log('📦 Storage bucket: vault-files');

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vault-files')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        console.error('Error code:', uploadError.statusCode);
        console.error('Error message:', uploadError.message);
        console.error('Storage path:', storagePath);
        console.error('File size:', file.size);
        console.error('File type:', file.type);
        
        // More specific error messages
        if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('not found')) {
          throw new Error('Storage bucket "vault-files" not found. Please run storage-setup.sql in Supabase SQL Editor.');
        }
        if (uploadError.message?.includes('row-level security') || uploadError.message?.includes('RLS')) {
          throw new Error('Storage permission denied. Check storage policies in Supabase.');
        }
        if (uploadError.message?.includes('JWT')) {
          throw new Error('Authentication token expired. Please log out and log back in.');
        }
        throw new Error(`Upload failed: ${uploadError.message || 'Unknown error'}`);
      }

      console.log('✅ File uploaded successfully:', uploadData?.path);

      const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
      const size = `${sizeInMB}MB`;

      console.log('💾 Saving document metadata to database...');

      const { data: docData, error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          title: metadata.title,
          category: metadata.category,
          upload_date: new Date().toISOString().split('T')[0],
          expiry_date: metadata.expiryDate || null,
          file_type: fileType,
          size: size,
          tags: metadata.tags || [],
          storage_path: storagePath
        })
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database error:', dbError);
        console.error('Error code:', dbError.code);
        console.error('Error message:', dbError.message);
        console.error('Error details:', dbError.details);
        
        // Try to clean up uploaded file
        try {
          await supabase.storage.from('vault-files').remove([storagePath]);
          console.log('🧹 Cleaned up uploaded file');
        } catch (cleanupError) {
          console.error('Failed to cleanup file:', cleanupError);
        }
        
        if (dbError.message?.includes('row-level security') || dbError.message?.includes('RLS')) {
          throw new Error('Database permission denied. Check RLS policies on documents table.');
        }
        throw new Error(`Failed to save document: ${dbError.message || 'Unknown error'}`);
      }

      console.log('✅ Document saved successfully:', docData.id);

      return {
        id: docData.id,
        userId: docData.user_id,
        title: docData.title,
        category: docData.category as DocCategory,
        uploadDate: docData.upload_date,
        expiryDate: docData.expiry_date || undefined,
        fileType: docData.file_type as 'pdf' | 'jpg' | 'png',
        size: docData.size,
        tags: docData.tags || []
      };
    } catch (error: any) {
      console.error('Error in addDocument:', error);
      throw new Error(error.message || 'Failed to add document');
    }
  },

  getDocumentUrl: async (documentId: string): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: doc, error: docError } = await supabase
        .from('documents')
        .select('storage_path')
        .eq('id', documentId)
        .eq('user_id', user.id)
        .single();

      if (docError || !doc) {
        throw new Error('Document not found');
      }

      const { data, error } = await supabase.storage
        .from('vault-files')
        .createSignedUrl(doc.storage_path, 60);

      if (error) {
        console.error('Error generating signed URL:', error);
        throw error;
      }

      return data?.signedUrl || null;
    } catch (error) {
      console.error('Error in getDocumentUrl:', error);
      return null;
    }
  },

  getTraining: async (): Promise<TrainingRecord[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('training_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date_completed', { ascending: false });

      if (error) {
        console.error('Error fetching training records:', error);
        throw error;
      }

      return (data || []).map((record: any) => ({
        id: record.id,
        courseName: record.course_name,
        provider: record.provider,
        dateCompleted: record.date_completed,
        expiryDate: record.expiry_date,
        category: record.category,
        status: record.status as TrainingStatus,
        linkedDocId: record.linked_doc_id || undefined
      }));
    } catch (error) {
      console.error('Error in getTraining:', error);
      return [];
    }
  },

  addTraining: async (record: Omit<TrainingRecord, 'id'>): Promise<TrainingRecord> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('training_records')
        .insert({
          user_id: user.id,
          course_name: record.courseName,
          provider: record.provider,
          date_completed: record.dateCompleted,
          expiry_date: record.expiryDate,
          category: record.category,
          status: record.status,
          linked_doc_id: record.linkedDocId || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding training record:', error);
        throw error;
      }

      return {
        id: data.id,
        courseName: data.course_name,
        provider: data.provider,
        dateCompleted: data.date_completed,
        expiryDate: data.expiry_date,
        category: data.category,
        status: data.status as TrainingStatus,
        linkedDocId: data.linked_doc_id || undefined
      };
    } catch (error: any) {
      console.error('Error in addTraining:', error);
      throw new Error(error.message || 'Failed to add training record');
    }
  },

  getCPD: async (): Promise<CPDEntry[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('cpd_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching CPD entries:', error);
        throw error;
      }

      return (data || []).map((entry: any) => ({
        id: entry.id,
        title: entry.title,
        date: entry.date,
        hours: Number(entry.hours),
        participatory: entry.participatory,
        reflection: entry.reflection,
        category: entry.category,
        tags: entry.tags || [],
        evidenceUrl: entry.evidence_url || undefined
      }));
    } catch (error) {
      console.error('Error in getCPD:', error);
      return [];
    }
  },

  addCPD: async (entry: Omit<CPDEntry, 'id'>): Promise<CPDEntry> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('cpd_entries')
        .insert({
          user_id: user.id,
          title: entry.title,
          date: entry.date,
          hours: entry.hours,
          participatory: entry.participatory,
          reflection: entry.reflection,
          category: entry.category,
          tags: entry.tags || [],
          evidence_url: entry.evidenceUrl || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding CPD entry:', error);
        throw error;
      }

      return {
        id: data.id,
        title: data.title,
        date: data.date,
        hours: Number(data.hours),
        participatory: data.participatory,
        reflection: data.reflection,
        category: data.category,
        tags: data.tags || [],
        evidenceUrl: data.evidence_url || undefined
      };
    } catch (error: any) {
      console.error('Error in addCPD:', error);
      throw new Error(error.message || 'Failed to add CPD entry');
    }
  },

  getCompetencies: async (): Promise<Competency[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('competencies')
        .select('*')
        .eq('user_id', user.id)
        .order('date_assessed', { ascending: false, nullsFirst: false });

      if (error) {
        console.error('Error fetching competencies:', error);
        throw error;
      }

      return (data || []).map((comp: any) => ({
        id: comp.id,
        skillName: comp.skill_name,
        category: comp.category as Competency['category'],
        dateAssessed: comp.date_assessed || undefined,
        assessorName: comp.assessor_name || undefined,
        assessorRole: comp.assessor_role || undefined,
        status: comp.status as Competency['status'],
        setting: comp.setting || undefined,
        notes: comp.notes || undefined,
        evidenceVoiceLogId: comp.evidence_voice_log_id || undefined
      }));
    } catch (error) {
      console.error('Error in getCompetencies:', error);
      return [];
    }
  },

  addCompetency: async (comp: Omit<Competency, 'id'>): Promise<Competency> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('competencies')
        .insert({
          user_id: user.id,
          skill_name: comp.skillName,
          category: comp.category,
          date_assessed: comp.dateAssessed || null,
          assessor_name: comp.assessorName || null,
          assessor_role: comp.assessorRole || null,
          status: comp.status,
          setting: comp.setting || null,
          notes: comp.notes || null,
          evidence_voice_log_id: comp.evidenceVoiceLogId || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding competency:', error);
        throw error;
      }

      return {
        id: data.id,
        skillName: data.skill_name,
        category: data.category,
        dateAssessed: data.date_assessed || undefined,
        assessorName: data.assessor_name || undefined,
        assessorRole: data.assessor_role || undefined,
        status: data.status,
        setting: data.setting || undefined,
        notes: data.notes || undefined,
        evidenceVoiceLogId: data.evidence_voice_log_id || undefined
      };
    } catch (error: any) {
      console.error('Error in addCompetency:', error);
      throw new Error(error.message || 'Failed to add competency');
    }
  },

  getCareerPath: async (): Promise<CareerPath> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: pathData, error: pathError } = await supabase
        .from('career_paths')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (pathError && pathError.code !== 'PGRST116') {
        console.error('Error fetching career path:', pathError);
        throw pathError;
      }

      if (!pathData) {
        const { data: newPath, error: createError } = await supabase
          .from('career_paths')
          .insert({
            user_id: user.id,
            "current_band": 'Band 5',
            "target_band": 'Band 6',
            specialty: 'General'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating career path:', createError);
          throw createError;
        }

        return {
          id: newPath.id,
          currentBand: newPath["current_band"],
          targetBand: newPath["target_band"],
          specialty: newPath.specialty,
          currentSalary: newPath.current_salary ? Number(newPath.current_salary) : undefined,
          targetSalary: newPath.target_salary ? Number(newPath.target_salary) : undefined,
          requirements: []
        };
      }

      const { data: requirements, error: reqError } = await supabase
        .from('career_requirements')
        .select('*')
        .eq('career_path_id', pathData.id)
        .order('created_at', { ascending: true });

      if (reqError) {
        console.error('Error fetching requirements:', reqError);
        throw reqError;
      }

      return {
        id: pathData.id,
        currentBand: pathData["current_band"],
        targetBand: pathData["target_band"],
        specialty: pathData.specialty,
        currentSalary: pathData.current_salary ? Number(pathData.current_salary) : undefined,
        targetSalary: pathData.target_salary ? Number(pathData.target_salary) : undefined,
        requirements: (requirements || []).map((req: any) => ({
          id: req.id,
          title: req.title,
          type: req.type as CareerRequirement['type'],
          status: req.status as CareerRequirement['status'],
          description: req.description
        }))
      };
    } catch (error) {
      console.error('Error in getCareerPath:', error);
      return MOCK_PATHWAY;
    }
  },

  updateCareerPath: async (updates: {
    currentBand: string;
    targetBand: string;
    specialty: string;
    currentSalary?: number;
    targetSalary?: number;
  }): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('career_paths')
        .update({
          "current_band": updates.currentBand,
          "target_band": updates.targetBand,
          specialty: updates.specialty,
          current_salary: updates.currentSalary || null,
          target_salary: updates.targetSalary || null
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating career path:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Error in updateCareerPath:', error);
      throw new Error(error.message || 'Failed to update career path');
    }
  },

  updateRequirementStatus: async (reqId: string, status: CareerRequirement['status']): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: req, error: reqError } = await supabase
        .from('career_requirements')
        .select('career_path_id, career_paths!inner(user_id)')
        .eq('id', reqId)
        .single();

      if (reqError || !req) {
        throw new Error('Requirement not found');
      }

      const { error: updateError } = await supabase
        .from('career_requirements')
        .update({ status })
        .eq('id', reqId);

      if (updateError) {
        console.error('Error updating requirement:', updateError);
        throw updateError;
      }
    } catch (error: any) {
      console.error('Error in updateRequirementStatus:', error);
      throw new Error(error.message || 'Failed to update requirement');
    }
  },

  addCareerRequirement: async (careerPathId: string, requirement: Omit<CareerRequirement, 'id'>): Promise<CareerRequirement> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('career_requirements')
        .insert({
          career_path_id: careerPathId,
          title: requirement.title,
          type: requirement.type,
          status: requirement.status || 'Not Started',
          description: requirement.description || ''
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding requirement:', error);
        throw error;
      }

      return {
        id: data.id,
        title: data.title,
        type: data.type as CareerRequirement['type'],
        status: data.status as CareerRequirement['status'],
        description: data.description
      };
    } catch (error: any) {
      console.error('Error in addCareerRequirement:', error);
      throw new Error(error.message || 'Failed to add requirement');
    }
  },

  getReflections: async (): Promise<Reflection[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching reflections:', error);
        throw error;
      }

      // Map database fields to TypeScript interface
      return (data || []).map((r: any) => ({
        id: r.id,
        date: r.date,
        title: r.title,
        content: r.content || '', // Legacy field
        nmcQuestion1: r.nmc_question1,
        nmcQuestion2: r.nmc_question2,
        nmcQuestion3: r.nmc_question3,
        nmcQuestion4: r.nmc_question4,
        codeThemes: r.code_themes || [],
        tags: r.tags || [],
        method: (r.method as 'Written' | 'Voice') || 'Written'
      }));
    } catch (error) {
      console.error('Error in getReflections:', error);
      return [];
    }
  },
  
  addReflection: async (reflection: Omit<Reflection, 'id'>): Promise<Reflection> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Map TypeScript interface to database fields
      const { data, error } = await supabase
        .from('reflections')
        .insert({
          user_id: user.id,
          date: reflection.date,
          title: reflection.title,
          content: reflection.content || '', // Legacy field for backwards compatibility
          nmc_question1: reflection.nmcQuestion1,
          nmc_question2: reflection.nmcQuestion2,
          nmc_question3: reflection.nmcQuestion3,
          nmc_question4: reflection.nmcQuestion4,
          code_themes: reflection.codeThemes || [],
          tags: reflection.tags || [],
          method: reflection.method || 'Written'
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding reflection:', error);
        throw error;
      }

      // Map back to TypeScript interface
      return {
        id: data.id,
        date: data.date,
        title: data.title,
        content: data.content || '',
        nmcQuestion1: data.nmc_question1,
        nmcQuestion2: data.nmc_question2,
        nmcQuestion3: data.nmc_question3,
        nmcQuestion4: data.nmc_question4,
        codeThemes: data.code_themes || [],
        tags: data.tags || [],
        method: (data.method as 'Written' | 'Voice') || 'Written'
      };
    } catch (error: any) {
      console.error('Error in addReflection:', error);
      throw new Error(error.message || 'Failed to add reflection');
    }
  },

  getVoiceLogs: async (): Promise<VoiceLog[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('voice_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching voice logs:', error);
        throw error;
      }

      return (data || []).map((log: any) => ({
        id: log.id,
        date: log.date,
        durationSeconds: log.duration_seconds,
        title: log.title || undefined,
        transcription: log.transcription,
        status: log.status as VoiceLog['status'],
        suggestedType: log.suggested_type as VoiceLog['suggestedType']
      }));
    } catch (error) {
      console.error('Error in getVoiceLogs:', error);
      return [];
    }
  },

  deleteVoiceLog: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('voice_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error in deleteVoiceLog:', error);
      throw error;
    }
  },

  updateVoiceLog: async (id: string, updates: Partial<VoiceLog>): Promise<VoiceLog> => {
    try {
      const { data, error } = await supabase
        .from('voice_logs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as VoiceLog;
    } catch (error) {
      console.error('Error in updateVoiceLog:', error);
      throw error;
    }
  },

  addVoiceLog: async (log: Omit<VoiceLog, 'id'>): Promise<VoiceLog> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('voice_logs')
        .insert({
          user_id: user.id,
          date: log.date,
          duration_seconds: log.durationSeconds,
          title: log.title || null,
          transcription: log.transcription,
          status: log.status,
          suggested_type: log.suggestedType || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding voice log:', error);
        throw error;
      }

      return {
        id: data.id,
        date: data.date,
        durationSeconds: data.duration_seconds,
        title: data.title || undefined,
        transcription: data.transcription,
        status: data.status,
        suggestedType: data.suggested_type || undefined
      };
    } catch (error: any) {
      console.error('Error in addVoiceLog:', error);
      throw new Error(error.message || 'Failed to add voice log');
    }
  },

  getRecommendations: async (): Promise<Recommendation[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }

      return (data || []).map((rec: any) => ({
        id: rec.id,
        title: rec.title,
        type: rec.type as Recommendation['type'],
        reason: rec.reason,
        status: rec.status as Recommendation['status'],
        provider: rec.provider || undefined,
        estimatedHours: rec.estimated_hours || undefined
      }));
    } catch (error) {
      console.error('Error in getRecommendations:', error);
      return [];
    }
  },

  completeRecommendation: async (id: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('recommendations')
        .update({ status: 'Completed' })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error completing recommendation:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Error in completeRecommendation:', error);
      throw new Error(error.message || 'Failed to complete recommendation');
    }
  }
};
