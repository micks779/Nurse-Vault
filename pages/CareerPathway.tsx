import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import { CareerPath, CareerRequirement } from '../types';
import { Trophy, CheckCircle, Circle, ArrowRight, Loader, Sparkles } from 'lucide-react';

const CareerPathway: React.FC = () => {
  const [path, setPath] = useState<CareerPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  useEffect(() => {
    dataService.getCareerPath().then(data => {
      setPath(data);
      setLoading(false);
    });
  }, []);

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
    if (!path) return 0;
    const completed = path.requirements.filter(r => r.status === 'Done').length;
    return Math.round((completed / path.requirements.length) * 100);
  };

  const generateAIRecommendation = () => {
    // Mocking the "AI" or "Rule-Based" engine
    setRecommendation("Based on your path to Band 6, you should prioritize the 'Mentorship Qualification'. We found a course 'SLAiP Level 6' starting next month at your Trust. Completing this will increase your readiness by 25%.");
  };

  if (loading) return <div className="p-10 flex justify-center text-brand-primary"><Loader className="animate-spin" /></div>;
  if (!path) return <div>No pathway selected.</div>;

  return (
    <div className="space-y-8">
      {/* Header Path Visualizer */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-primary to-brand-primaryDark p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Career Progression Pathway</h1>
          <p className="mt-2 text-brand-mint/80">Tracking your journey from {path.currentBand} to {path.targetBand} in {path.specialty}.</p>
          
          <div className="mt-8 flex items-center justify-between gap-4 max-w-lg">
             <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-mint/20 border-2 border-brand-mint font-bold text-brand-mint">
                  B5
                </div>
                <span className="mt-2 text-sm font-medium">Current</span>
             </div>
             
             <div className="flex-1 flex flex-col items-center">
               <div className="w-full h-1 bg-brand-primaryDark rounded-full relative">
                 <div className="absolute left-0 top-0 h-full bg-brand-mint rounded-full transition-all duration-700" style={{ width: `${getProgress()}%` }} />
               </div>
               <span className="mt-2 text-xs text-brand-mint font-semibold">{getProgress()}% Ready</span>
             </div>

             <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-primary font-bold shadow-lg border-2 border-white">
                  B6
                </div>
                <span className="mt-2 text-sm font-medium">Target</span>
             </div>
          </div>
        </div>
        
        {/* Decorative background element */}
        <Trophy className="absolute right-4 bottom-4 h-48 w-48 text-white/5 rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Requirements List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-brand-charcoal">Core Requirements</h2>
          
          <div className="space-y-4">
            {path.requirements.map((req) => (
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
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-6">
           <div className="rounded-xl border border-brand-primary/10 bg-brand-primary/5 p-6">
              <div className="flex items-center gap-2 text-brand-primary mb-4">
                <Sparkles size={20} />
                <h3 className="font-bold">Smart Recommendations</h3>
              </div>
              
              {!recommendation ? (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-600 mb-4">Get personalized training advice to close your skills gap.</p>
                  <button 
                    onClick={generateAIRecommendation}
                    className="w-full rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark transition-colors shadow-sm"
                  >
                    Analyze My Path
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-sm text-brand-charcoal leading-relaxed bg-white p-4 rounded-lg border border-brand-primary/10 shadow-sm">
                    {recommendation}
                  </p>
                  <button onClick={() => setRecommendation(null)} className="mt-4 text-xs text-brand-primary hover:text-brand-primaryDark font-medium">
                    Refresh Analysis
                  </button>
                </div>
              )}
           </div>

           <div className="rounded-xl border border-slate-200 bg-white p-6">
             <h3 className="font-bold text-brand-charcoal mb-4">Band 6 Salary Impact</h3>
             <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Current (Band 5)</span>
                 <span className="font-medium text-brand-charcoal">£28,407</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Target (Band 6)</span>
                 <span className="font-medium text-brand-primary">£35,392</span>
               </div>
               <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                 <span className="text-xs font-medium text-slate-400">Potential Increase</span>
                 <span className="text-lg font-bold text-brand-primary">+£6,985</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPathway;