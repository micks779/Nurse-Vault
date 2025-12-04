import React, { useEffect, useState } from 'react';
import { Award, CheckCircle, Circle, Clock, Plus, Search, Filter, Mic, ChevronRight, X, FileText } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Competency, CareerPath, VoiceLog } from '../types';

// Mock Library for the prototype
const COMPETENCY_LIBRARY = [
  { name: 'Venepuncture', category: 'Clinical' },
  { name: 'Cannulation', category: 'Clinical' },
  { name: 'Male Catheterisation', category: 'Clinical' },
  { name: 'Female Catheterisation', category: 'Clinical' },
  { name: 'IV Medication Administration', category: 'Clinical' },
  { name: 'NG Tube Care', category: 'Clinical' },
  { name: 'NEWS2 Assessment', category: 'Clinical' },
  { name: 'Wound Care (Aseptic)', category: 'Clinical' },
  { name: 'SBAR Escalation', category: 'Communication' },
  { name: 'Shift Leadership', category: 'Leadership' },
  { name: 'Safeguarding Referral', category: 'Communication' },
  { name: 'Mentoring Students', category: 'Leadership' },
];

const Competencies: React.FC = () => {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [pathwayRequirements, setPathwayRequirements] = useState<any[]>([]);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'select' | 'form'>('select');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [formData, setFormData] = useState<Partial<Competency>>({
    status: 'In Progress',
    category: 'Clinical'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [comps, path, logs] = await Promise.all([
      dataService.getCompetencies(),
      dataService.getCareerPath(),
      dataService.getVoiceLogs()
    ]);

    setCompetencies(comps);
    setVoiceLogs(logs);

    // Extract "Not Started" competencies from the career pathway to display in the list
    const reqs = path.requirements.filter(r => 
      r.type === 'Competency' && 
      r.status === 'Not Started' &&
      !comps.find(c => c.skillName === r.title) // Don't show if already logged
    );
    setPathwayRequirements(reqs);
  };

  const handleAddCompetency = async () => {
    if (!formData.skillName) return;

    const newComp: Competency = {
      id: Math.random().toString(36).substr(2, 9),
      skillName: formData.skillName,
      category: formData.category as any || 'Clinical',
      status: formData.status as any || 'Not Started',
      dateAssessed: formData.dateAssessed,
      assessorName: formData.assessorName,
      assessorRole: formData.assessorRole,
      setting: formData.setting,
      notes: formData.notes,
      evidenceVoiceLogId: formData.evidenceVoiceLogId
    };

    await dataService.addCompetency(newComp);
    setIsModalOpen(false);
    setFormData({ status: 'In Progress', category: 'Clinical' }); // Reset
    loadData();
  };

  const startAddProcess = (skillName?: string, category?: string) => {
    setFormData({ 
      skillName: skillName || '', 
      category: (category as any) || 'Clinical',
      status: 'In Progress'
    });
    setModalStep(skillName ? 'form' : 'select');
    setIsModalOpen(true);
  };

  // Filter Logic
  const filteredComps = competencies.filter(c => activeCategory === 'All' || c.category === activeCategory);
  const signedOff = filteredComps.filter(c => c.status === 'Signed Off');
  const inProgress = filteredComps.filter(c => c.status === 'In Progress');
  // Combine logged "Not Started" with Pathway requirements
  const notStarted = [
    ...filteredComps.filter(c => c.status === 'Not Started'),
    ...pathwayRequirements.map(r => ({
      id: r.id,
      skillName: r.title,
      category: 'Clinical', // Assumption for pathway items
      status: 'Not Started',
      notes: r.description,
      isPathwayRequirement: true
    }))
  ].filter(c => activeCategory === 'All' || c.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Competencies</h1>
          <p className="text-slate-500">Track hands-on clinical and professional skills for your progression.</p>
        </div>
        <button 
          onClick={() => startAddProcess()}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 font-semibold text-white hover:bg-brand-primaryDark transition-colors shadow-sm"
        >
          <Plus size={18} /> Add Competency
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
         <div className="rounded-xl border border-brand-mint/30 bg-brand-mint/10 p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-mint/30 text-brand-primary">
               <CheckCircle size={20} />
            </div>
            <p className="text-2xl font-bold text-brand-primary">{signedOff.length}</p>
            <p className="text-xs font-medium text-brand-primary/70 uppercase tracking-wide">Signed Off</p>
         </div>
         <div className="rounded-xl border border-brand-sand/30 bg-brand-sand/10 p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-sand/30 text-brand-sand">
               <Clock size={20} />
            </div>
            <p className="text-2xl font-bold text-brand-sand">{inProgress.length}</p>
            <p className="text-xs font-medium text-brand-sand/80 uppercase tracking-wide">In Progress</p>
         </div>
         <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
               <Circle size={20} />
            </div>
            <p className="text-2xl font-bold text-brand-charcoal">{notStarted.length}</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Not Started</p>
         </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {['All', 'Clinical', 'Leadership', 'Communication', 'Digital'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat 
                ? 'bg-brand-primary text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lists */}
      <div className="space-y-8">
        
        {/* Group 1: Signed Off */}
        {signedOff.length > 0 && (
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-primary">
              <CheckCircle size={16} /> Signed Off
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {signedOff.map((comp) => (
                <div key={comp.id} className="relative rounded-xl border border-brand-mint/30 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-mint">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-brand-charcoal">{comp.skillName}</h4>
                      <p className="text-xs text-slate-500 mt-1">{comp.setting} • {comp.dateAssessed}</p>
                    </div>
                    <span className="rounded-full bg-brand-mint/20 px-2 py-1 text-[10px] font-bold uppercase text-brand-primary">
                      Signed Off
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <Award size={16} className="text-brand-mint" />
                    <span>Assessed by: <span className="font-medium">{comp.assessorName}</span> ({comp.assessorRole})</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Group 2: In Progress */}
        {inProgress.length > 0 && (
          <section>
             <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-sand">
              <Clock size={16} /> In Progress
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {inProgress.map((comp) => (
                <div key={comp.id} className="group relative rounded-xl border border-brand-sand/30 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-sand">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-brand-charcoal">{comp.skillName}</h4>
                      <p className="text-xs text-slate-500 mt-1">{comp.setting || 'No setting logged'}</p>
                    </div>
                    <span className="rounded-full bg-brand-sand/10 px-2 py-1 text-[10px] font-bold uppercase text-brand-sand">
                      In Progress
                    </span>
                  </div>
                  {comp.notes && (
                    <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-2 rounded italic border border-slate-100">
                      "{comp.notes}"
                    </p>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button className="text-sm font-medium text-brand-sand hover:text-amber-700">
                      Log Practice Attempt →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Group 3: Not Started / Required */}
        {notStarted.length > 0 && (
          <section>
             <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
              <Circle size={16} /> To Do / Pathway Requirements
            </h3>
            <div className="space-y-3">
              {notStarted.map((comp: any) => (
                <div key={comp.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <Plus size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-brand-charcoal">{comp.skillName}</h4>
                        {comp.isPathwayRequirement && (
                           <span className="text-xs text-brand-primary font-medium">Required for Band 6</span>
                        )}
                      </div>
                   </div>
                   <button 
                     onClick={() => startAddProcess(comp.skillName, comp.category)}
                     className="text-sm font-medium text-brand-primary hover:text-brand-primaryDark"
                   >
                     Start
                   </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* --- ADD COMPETENCY MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-charcoal/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-brand-charcoal">
                {modalStep === 'select' ? 'Add Competency' : `Log: ${formData.skillName}`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Step 1: Library Selection */}
            {modalStep === 'select' && (
              <div className="p-6">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search standard competencies..."
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-brand-primary focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 mb-6">
                  {COMPETENCY_LIBRARY
                    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => startAddProcess(item.name, item.category)}
                      className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left hover:bg-slate-50 group"
                    >
                      <span className="font-medium text-slate-700 group-hover:text-brand-primary">{item.name}</span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-primary" />
                    </button>
                  ))}
                  {COMPETENCY_LIBRARY.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">No matching skills found.</p>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4">
                   <button 
                     onClick={() => startAddProcess('', 'Clinical')}
                     className="w-full rounded-lg border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 hover:border-brand-primary hover:text-brand-primary"
                   >
                     + Create Custom Competency
                   </button>
                </div>
              </div>
            )}

            {/* Step 2: Details Form */}
            {modalStep === 'form' && (
              <div className="p-6 space-y-4">
                {!formData.skillName && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-brand-charcoal">Skill Name</label>
                    <input 
                      type="text" 
                      value={formData.skillName} 
                      onChange={e => setFormData({...formData, skillName: e.target.value})}
                      className="w-full rounded-lg border-slate-300"
                      placeholder="e.g. Tracheostomy Care"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="mb-1 block text-sm font-medium text-brand-charcoal">Status</label>
                      <select 
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                        className="w-full rounded-lg border-slate-300 text-sm"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Signed Off">Signed Off</option>
                      </select>
                   </div>
                   <div>
                      <label className="mb-1 block text-sm font-medium text-brand-charcoal">Date</label>
                      <input 
                        type="date" 
                        value={formData.dateAssessed || ''}
                        onChange={e => setFormData({...formData, dateAssessed: e.target.value})}
                        className="w-full rounded-lg border-slate-300 text-sm"
                      />
                   </div>
                </div>

                {formData.status !== 'Not Started' && (
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <div className="col-span-2 text-xs font-bold text-slate-500 uppercase">Assessor Details</div>
                     <div>
                        <label className="mb-1 block text-sm font-medium text-brand-charcoal">Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Sr. Jones"
                          value={formData.assessorName || ''}
                          onChange={e => setFormData({...formData, assessorName: e.target.value})}
                          className="w-full rounded-lg border-slate-300 text-sm"
                        />
                     </div>
                     <div>
                        <label className="mb-1 block text-sm font-medium text-brand-charcoal">Role</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Band 7"
                          value={formData.assessorRole || ''}
                          onChange={e => setFormData({...formData, assessorRole: e.target.value})}
                          className="w-full rounded-lg border-slate-300 text-sm"
                        />
                     </div>
                  </div>
                )}

                <div>
                   <label className="mb-1 block text-sm font-medium text-brand-charcoal">Notes / Reflection</label>
                   <textarea 
                     rows={3}
                     value={formData.notes || ''}
                     onChange={e => setFormData({...formData, notes: e.target.value})}
                     className="w-full rounded-lg border-slate-300 text-sm"
                     placeholder="What went well? What needs improvement?"
                   />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-charcoal">Evidence (Optional)</label>
                  <div className="relative">
                    <select 
                      value={formData.evidenceVoiceLogId || ''}
                      onChange={e => setFormData({...formData, evidenceVoiceLogId: e.target.value})}
                      className="w-full rounded-lg border-slate-300 text-sm pl-9 appearance-none"
                    >
                      <option value="">-- Select Voice Note --</option>
                      {voiceLogs.map(log => (
                        <option key={log.id} value={log.id}>
                          {new Date(log.date).toLocaleDateString()} - {log.transcription.substring(0, 30)}...
                        </option>
                      ))}
                    </select>
                    <Mic className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Link a recent voice note where you discussed this procedure.</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                   <button 
                     onClick={() => setModalStep('select')}
                     className="flex-1 rounded-lg py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                   >
                     Back
                   </button>
                   <button 
                     onClick={handleAddCompetency}
                     className="flex-1 rounded-lg bg-brand-primary py-2.5 text-sm font-medium text-white hover:bg-brand-primaryDark"
                   >
                     Save Record
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Competencies;