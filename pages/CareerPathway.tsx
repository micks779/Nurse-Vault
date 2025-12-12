import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import { CareerPath, CareerRequirement, Competency } from '../types';
import { Trophy, CheckCircle, Circle, ArrowRight, Loader, Sparkles, Edit2, X, Save, Plus, ExternalLink, BookOpen, Upload, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const CareerPathway: React.FC = () => {
  const [path, setPath] = useState<CareerPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ analysis: string; requirements: CareerRequirement[] } | null>(null);
  const [showJdModal, setShowJdModal] = useState(false);
  const [showSalaryDetails, setShowSalaryDetails] = useState(false);
  const [editForm, setEditForm] = useState({
    currentBand: '',
    targetBand: '',
    specialty: '',
    currentSalary: '',
    targetSalary: ''
  });

  useEffect(() => {
    loadCareerPath();
    loadCompetencies();
  }, []);

  const loadCompetencies = async () => {
    try {
      const comps = await dataService.getCompetencies();
      setCompetencies(comps);
    } catch (error) {
      console.error('Error loading competencies:', error);
    }
  };

  const loadCareerPath = async () => {
    try {
      setLoading(true);
      const data = await dataService.getCareerPath();
      if (data) {
        setPath(data);
        setEditForm({
          currentBand: data.currentBand || '',
          targetBand: data.targetBand || '',
          specialty: data.specialty || '',
          currentSalary: data.currentSalary?.toString() || '',
          targetSalary: data.targetSalary?.toString() || ''
        });
      }
    } catch (error) {
      console.error('Error loading career path:', error);
      // Set a default path to prevent crash
      setPath({
        id: 'default',
        currentBand: 'Band 5',
        targetBand: 'Band 6',
        specialty: 'General',
        requirements: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (reqId: string, currentStatus: string) => {
    if (!path) return;
    
    let newStatus: CareerRequirement['status'] = 'Not Started';
    if (currentStatus === 'Not Started') newStatus = 'In Progress';
    if (currentStatus === 'In Progress') newStatus = 'Done';
    
    // Update local state immediately for UI responsiveness
    const newRequirements = path.requirements.map(r => 
      r.id === reqId ? { ...r, status: newStatus } : r
    );
    setPath({ ...path, requirements: newRequirements });
    
    // Persist
    await dataService.updateRequirementStatus(reqId, newStatus);
  };

  const getProgress = () => {
    if (!path || path.requirements.length === 0) return 0;
    const completed = path.requirements.filter(r => r.status === 'Done').length;
    return Math.round((completed / path.requirements.length) * 100);
  };

  const getBandNumber = (band: string): string => {
    const match = band.match(/\d+/);
    return match ? `B${match[0]}` : band.substring(0, 2).toUpperCase();
  };

  const calculateSalaryDifference = (): number => {
    if (!path?.currentSalary || !path?.targetSalary) return 0;
    return path.targetSalary - path.currentSalary;
  };

  const handleSavePath = async () => {
    if (!path) return;
    
    setIsSaving(true);
    try {
      await dataService.updateCareerPath({
        currentBand: editForm.currentBand,
        targetBand: editForm.targetBand,
        specialty: editForm.specialty,
        currentSalary: editForm.currentSalary ? parseFloat(editForm.currentSalary) : undefined,
        targetSalary: editForm.targetSalary ? parseFloat(editForm.targetSalary) : undefined
      });
      
      await loadCareerPath();
      setShowEditModal(false);
    } catch (error: any) {
      console.error('Error saving career path:', error);
      alert(error.message || 'Failed to save career path');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      let text = '';
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else {
        // For PDF/Word, prompt user to paste
        setJdText('');
        alert('Please paste the job description text in the text area below.');
        setShowJdModal(true);
        return;
      }
      setJdText(text);
      setShowJdModal(true);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please paste the job description text instead.');
      setShowJdModal(true);
    }
  };

  const handleAnalyzeJD = async () => {
    if (!jdText.trim() || !path) {
      alert('Please enter a job description and ensure your career path is configured.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const userSkills = competencies
        .filter(c => c.status === 'Signed Off')
        .map(c => c.skillName)
        .join(', ');

      const context = `
Current Profile:
- Current Band: ${path.currentBand}
- Target Band: ${path.targetBand}
- Specialty: ${path.specialty}
- Current Competencies: ${userSkills || 'None logged yet'}

Job Description:
${jdText}
`;

      // Import aiService dynamically to avoid exposing API key in bundle if not set
      const { aiService } = await import('../services/aiService');
      const result = await aiService.analyzeJobDescriptionAndCreatePath(context, path);
      
      setAnalysisResult(result);
      
      // Add requirements to career path
      if (result.requirements && result.requirements.length > 0) {
        for (const req of result.requirements) {
          await dataService.addCareerRequirement(path.id, req);
        }
        await loadCareerPath();
      }
      
      setShowJdModal(false);
      setJdText('');
    } catch (error: any) {
      console.error('Error analyzing JD:', error);
      alert(`Error analyzing job description: ${error.message || 'Unknown error'}. Please check your VITE_GEMINI_API_KEY is set in .env.local if you want to use AI analysis.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center text-brand-primary"><Loader className="animate-spin" /></div>;
  if (!path) return <div className="p-10 text-center text-slate-500">No pathway data available. Please try refreshing the page.</div>;

  return (
    <div className="space-y-8">
      {/* Header Path Visualizer */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-primary to-brand-primaryDark p-8 text-white shadow-lg">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Career Progression Pathway</h1>
              <p className="mt-2 text-brand-mint/80">Tracking your journey from {path.currentBand} to {path.targetBand} in {path.specialty}.</p>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="ml-4 flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
            >
              <Edit2 size={16} />
              Edit Path
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-between gap-4 max-w-lg">
             <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-mint/20 border-2 border-brand-mint font-bold text-brand-mint">
                  {getBandNumber(path.currentBand)}
                </div>
                <span className="mt-2 text-sm font-medium">Current</span>
                {path.currentSalary && (
                  <span className="mt-1 text-xs text-brand-mint/80">£{path.currentSalary.toLocaleString()}</span>
                )}
             </div>
             
             <div className="flex-1 flex flex-col items-center">
               <div className="w-full h-1 bg-brand-primaryDark rounded-full relative">
                 <div className="absolute left-0 top-0 h-full bg-brand-mint rounded-full transition-all duration-700" style={{ width: `${getProgress()}%` }} />
               </div>
               <span className="mt-2 text-xs text-brand-mint font-semibold">{getProgress()}% Ready</span>
             </div>

             <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-primary font-bold shadow-lg border-2 border-white">
                  {getBandNumber(path.targetBand)}
                </div>
                <span className="mt-2 text-sm font-medium">Target</span>
                {path.targetSalary && (
                  <span className="mt-1 text-xs text-brand-mint/80">£{path.targetSalary.toLocaleString()}</span>
                )}
             </div>
          </div>
        </div>
        
        {/* Decorative background element */}
        <Trophy className="absolute right-4 bottom-4 h-48 w-48 text-white/5 rotate-12" />
      </div>

      {/* Career Pathway Resources Section */}
      <div className="rounded-xl border border-brand-primary/20 bg-gradient-to-r from-brand-primary/5 to-brand-mint/10 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <BookOpen className="text-brand-primary" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-brand-charcoal mb-2">Career Pathway Resources</h3>
            <p className="text-sm text-slate-700 mb-3">
              Explore comprehensive career pathways in health and social care through the North Central London Training Hub Career Pathway Tool. This resource provides detailed information on over 350 career opportunities, role descriptions, progression pathways, entry requirements, and apprenticeship opportunities.
            </p>
            <a
              href="https://www.ncltraininghub.org/career-pathway-tool"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark transition-colors shadow-sm"
            >
              <span>Visit NCL Career Pathway Tool</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Requirements List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-charcoal">Core Requirements</h2>
            <p className="text-xs text-slate-500">Not sure what's required? Check the <a href="https://www.ncltraininghub.org/career-pathway-tool" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">NCL Career Pathway Tool</a></p>
          </div>
          
          <div className="space-y-4">
            {path.requirements && path.requirements.length > 0 ? (
              path.requirements.map((req) => (
              <div 
                key={req.id} 
                className={`relative flex items-start gap-4 rounded-xl border p-5 transition-all
                  ${req.status === 'Done' ? 'bg-brand-mint/10 border-brand-mint/30' : 'bg-white border-slate-200 hover:border-brand-primary'}
                `}
              >
                <button 
                  onClick={() => handleStatusToggle(req.id, req.status)}
                  className={`mt-0.5 flex-shrink-0 rounded-full p-1 transition-colors ${
                    req.status === 'Done' ? 'text-brand-primary' : 
                    req.status === 'In Progress' ? 'text-brand-sand' : 'text-slate-300 hover:text-slate-400'
                  }`}
                >
                  {req.status === 'Done' ? <CheckCircle size={24} /> : <Circle size={24} />}
                </button>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-semibold ${req.status === 'Done' ? 'text-brand-primary' : 'text-brand-charcoal'}`}>{req.title}</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md ml-2">{req.type}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{req.description}</p>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      req.status === 'Done' ? 'bg-brand-mint/20 text-brand-primary' :
                      req.status === 'In Progress' ? 'bg-brand-sand/10 text-brand-sand' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {req.status}
                    </span>
                    {req.status !== 'Done' && (
                      <button className="text-xs text-brand-primary hover:underline">Link Evidence</button>
                    )}
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p className="mb-2">No requirements set yet.</p>
                <p className="text-sm">Requirements will appear here once your career path is configured.</p>
              </div>
            )}
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="space-y-6">
           <div className="rounded-xl border border-brand-primary/10 bg-brand-primary/5 p-6">
              <div className="flex items-center gap-2 text-brand-primary mb-4">
                <Sparkles size={20} />
                <h3 className="font-bold">Smart Recommendations</h3>
              </div>
              
              {analysisResult ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-brand-primary/20">
                    <h4 className="font-semibold text-brand-charcoal mb-2">Analysis</h4>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{analysisResult.analysis}</p>
                  </div>
                  
                  {analysisResult.requirements.length > 0 && (
                    <div className="bg-white p-4 rounded-lg border border-brand-primary/20">
                      <h4 className="font-semibold text-brand-charcoal mb-2">
                        Added {analysisResult.requirements.length} Requirements
                      </h4>
                      <p className="text-xs text-slate-600">
                        Check the "Core Requirements" section below to see your personalized career path.
                      </p>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => {
                      setAnalysisResult(null);
                      setShowJdModal(true);
                    }}
                    className="w-full rounded-lg border border-brand-primary/20 bg-white px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/5 transition-colors"
                  >
                    Analyze Another Job Description
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-brand-mint/10 border border-brand-mint/30 rounded-lg p-4">
                    <h4 className="font-semibold text-brand-charcoal mb-2 flex items-center gap-2">
                      <Sparkles size={16} className="text-brand-primary" />
                      Why Upload a Job Description?
                    </h4>
                    <p className="text-sm text-slate-700 mb-3">
                      Uploading a job description is the <strong>best way to create a personalized career path</strong> because it allows us to:
                    </p>
                    <ul className="text-sm text-slate-700 space-y-1.5 list-disc list-inside ml-2">
                      <li>Compare your current skills and competencies with the role requirements</li>
                      <li>Identify exactly what qualifications, training, or experience you need</li>
                      <li>Create a tailored list of requirements specific to that role</li>
                      <li>See the gap between where you are now and where you want to be</li>
                      <li>Get actionable steps to achieve your career goals</li>
                    </ul>
                    <p className="text-xs text-slate-600 mt-3 italic">
                      Simply paste the job description text or upload the file, and we'll analyze it to create your personalized career pathway.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="file"
                      id="jd-upload"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="jd-upload"
                      className="flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-brand-primary/30 bg-white px-4 py-3 text-sm font-medium text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-colors"
                    >
                      <Upload size={18} />
                      Upload Job Description (PDF, Word, or TXT)
                    </label>
                    
                    <button
                      onClick={() => setShowJdModal(true)}
                      className="w-full rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark transition-colors shadow-sm"
                    >
                      Or Paste Job Description Text
                    </button>
                  </div>
                </div>
              )}
           </div>

           <div className="rounded-xl border border-slate-200 bg-white p-6">
             <button
               onClick={() => setShowSalaryDetails(!showSalaryDetails)}
               className="w-full flex items-center justify-between text-left"
             >
               <h3 className="font-bold text-brand-charcoal">Salary Information</h3>
               {showSalaryDetails ? (
                 <ChevronUp size={20} className="text-slate-400" />
               ) : (
                 <ChevronDown size={20} className="text-slate-400" />
               )}
             </button>
             
             {showSalaryDetails && (
               <div className="mt-4 space-y-3">
                 {path.currentSalary && path.targetSalary ? (
                   <>
                     <div className="flex justify-between text-sm">
                       <span className="text-slate-500">Current ({path.currentBand})</span>
                       <span className="font-medium text-brand-charcoal">£{path.currentSalary.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-slate-500">Target ({path.targetBand})</span>
                       <span className="font-medium text-brand-primary">£{path.targetSalary.toLocaleString()}</span>
                     </div>
                     <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                       <span className="text-xs font-medium text-slate-400">Potential Increase</span>
                       <span className="text-lg font-bold text-brand-primary">
                         {calculateSalaryDifference() > 0 ? '+' : ''}£{calculateSalaryDifference().toLocaleString()}
                       </span>
                     </div>
                   </>
                 ) : (
                   <div className="text-center py-4">
                     <p className="text-sm text-slate-500 mb-2">Add salary information to see impact</p>
                     <button
                       onClick={() => {
                         setShowSalaryDetails(false);
                         setShowEditModal(true);
                       }}
                       className="text-xs text-brand-primary hover:underline"
                     >
                       Edit Path
                     </button>
                   </div>
                 )}
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Edit Career Path Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !isSaving && setShowEditModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-brand-charcoal">Edit Career Path</h2>
              <button
                onClick={() => !isSaving && setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600"
                disabled={isSaving}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                  Current Band <span className="text-red-500">*</span>
                </label>
                <select
                  value={editForm.currentBand}
                  onChange={(e) => setEditForm(prev => ({ ...prev, currentBand: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  disabled={isSaving}
                >
                  <option value="Band 2">Band 2</option>
                  <option value="Band 3">Band 3</option>
                  <option value="Band 4">Band 4</option>
                  <option value="Band 5">Band 5</option>
                  <option value="Band 6">Band 6</option>
                  <option value="Band 7">Band 7</option>
                  <option value="Band 8">Band 8</option>
                  <option value="Band 9">Band 9</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                  Target Band <span className="text-red-500">*</span>
                </label>
                <select
                  value={editForm.targetBand}
                  onChange={(e) => setEditForm(prev => ({ ...prev, targetBand: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  disabled={isSaving}
                >
                  <option value="Band 2">Band 2</option>
                  <option value="Band 3">Band 3</option>
                  <option value="Band 4">Band 4</option>
                  <option value="Band 5">Band 5</option>
                  <option value="Band 6">Band 6</option>
                  <option value="Band 7">Band 7</option>
                  <option value="Band 8">Band 8</option>
                  <option value="Band 9">Band 9</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.specialty}
                  onChange={(e) => setEditForm(prev => ({ ...prev, specialty: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="e.g., General, Mental Health, Paediatrics"
                  disabled={isSaving}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1">
                    Current Salary (Optional)
                  </label>
                  <input
                    type="number"
                    value={editForm.currentSalary}
                    onChange={(e) => setEditForm(prev => ({ ...prev, currentSalary: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    placeholder="£28,407"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1">
                    Target Salary (Optional)
                  </label>
                  <input
                    type="number"
                    value={editForm.targetSalary}
                    onChange={(e) => setEditForm(prev => ({ ...prev, targetSalary: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    placeholder="£35,392"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-200 p-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSavePath}
                disabled={isSaving || !editForm.currentBand || !editForm.targetBand || !editForm.specialty}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Description Upload/Input Modal */}
      {showJdModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !isAnalyzing && setShowJdModal(false)}
        >
          <div 
            className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-brand-charcoal">Analyze Job Description</h2>
                <p className="text-sm text-slate-500 mt-1">Paste or upload a job description to get personalized career path recommendations</p>
              </div>
              <button
                onClick={() => {
                  if (!isAnalyzing) {
                    setShowJdModal(false);
                    setJdText('');
                  }
                }}
                className="text-slate-400 hover:text-slate-600"
                disabled={isAnalyzing}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">
                    Job Description Text
                  </label>
                  <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the job description here... Include details about required qualifications, skills, experience, and responsibilities."
                    className="w-full h-64 rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none"
                    disabled={isAnalyzing}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    The more detail you include, the better the recommendations will be.
                  </p>
                </div>

                {isAnalyzing && (
                  <div className="flex items-center justify-center gap-2 p-4 bg-brand-primary/5 rounded-lg">
                    <Loader className="animate-spin text-brand-primary" size={20} />
                    <span className="text-sm text-brand-charcoal">Analyzing job description and creating career path...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-200 p-6">
              <button
                onClick={() => {
                  setShowJdModal(false);
                  setJdText('');
                }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                disabled={isAnalyzing}
              >
                Cancel
              </button>
              <button
                onClick={handleAnalyzeJD}
                disabled={isAnalyzing || !jdText.trim() || !path}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Analyze & Create Path
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPathway;