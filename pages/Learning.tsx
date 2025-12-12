import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Save, Sparkles, BookOpen, Clock, CheckCircle, Plus, FileText, BrainCircuit, ChevronRight, Loader2, X, Edit2, Trash2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { aiService } from '../services/aiService';
import { CPDEntry, VoiceLog, Reflection, Recommendation, UserProfile } from '../types';

type Tab = 'cpd' | 'voice' | 'reflections' | 'recommendations' | 'revalidation';

const Learning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('cpd');
  const [cpdEntries, setCpdEntries] = useState<CPDEntry[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cpd, ref, voice, recs, prof] = await Promise.all([
      dataService.getCPD(),
      dataService.getReflections(),
      dataService.getVoiceLogs(),
      dataService.getRecommendations(),
      dataService.getProfile()
    ]);
    setCpdEntries(cpd);
    setReflections(ref);
    setVoiceLogs(voice);
    setRecommendations(recs);
    setProfile(prof);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-brand-charcoal">Learning & Development</h1>
        <p className="text-slate-500">Manage your CPD, record reflections, and track revalidation progress.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Tabs">
          {[
            { id: 'cpd', label: 'CPD Log', icon: BookOpen },
            { id: 'voice', label: 'Voice Notes', icon: Mic },
            { id: 'reflections', label: 'Reflections', icon: BrainCircuit },
            { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
            { id: 'revalidation', label: 'Revalidation', icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}
                `}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'cpd' && <CPDTab entries={cpdEntries} refresh={loadData} />}
        {activeTab === 'voice' && <VoiceTab logs={voiceLogs} refresh={loadData} />}
        {activeTab === 'reflections' && <ReflectionsTab reflections={reflections} refresh={loadData} />}
        {activeTab === 'recommendations' && <RecommendationsTab recommendations={recommendations} profile={profile} refresh={loadData} />}
        {activeTab === 'revalidation' && <RevalidationTab cpdEntries={cpdEntries} reflections={reflections} profile={profile} />}
      </div>
    </div>
  );
};

/* --- Helper Components --- */

/**
 * A Textarea wrapper that includes a microphone button for real-time voice-to-text dictation.
 */
const VoiceInputArea: React.FC<{ 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
  minRows?: number;
}> = ({ value, onChange, placeholder, minRows = 3 }) => {
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef<boolean>(false);
  const accumulatedTranscriptRef = useRef<string>(''); // Persistent transcript across restarts

  const startDictation = () => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice dictation. Please use Chrome, Edge, or Safari.");
      return;
    }

    // Initialize accumulated transcript with current value if starting fresh
    if (!isDictating) {
      accumulatedTranscriptRef.current = value;
    }

    isManuallyStoppedRef.current = false;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-GB'; // British English for UK nurses

    recognition.onstart = () => {
      setIsDictating(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = accumulatedTranscriptRef.current; // Always start from accumulated transcript

      // Process only new results since last event
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Update accumulated transcript (only final parts)
      accumulatedTranscriptRef.current = finalTranscript;
      
      // Update state with accumulated + interim
      onChange(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // User paused - this is normal, recognition will auto-restart
        return;
      }
      setIsDictating(false);
      if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please enable microphone permissions.");
      }
    };

    recognition.onend = () => {
      // Only restart if it wasn't manually stopped and we're still in dictation mode
      if (!isManuallyStoppedRef.current && isDictating) {
        try {
          // Restart recognition - transcript is preserved in accumulatedTranscriptRef
          recognition.start();
        } catch (e) {
          // Recognition already started or error occurred
          console.log('Recognition restart:', e);
        }
      } else {
        setIsDictating(false);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopDictation = () => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsDictating(false);
    }
    // Keep value - don't clear it
  };

  return (
    <div className="relative">
      <textarea 
        className={`w-full rounded-lg border-slate-300 shadow-sm p-3 border focus:ring-1 focus:ring-brand-primary pr-12 ${isDictating ? 'bg-brand-primary/5 border-brand-primary' : ''}`}
        rows={minRows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      
      <div className="absolute bottom-3 right-3">
        {isDictating ? (
          <button 
            onClick={stopDictation}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors animate-pulse"
            title="Stop Dictation"
            type="button"
          >
            <Square size={14} fill="currentColor" />
          </button>
        ) : (
          <button 
            onClick={startDictation}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
            title="Start Dictation (speak and text will appear)"
            type="button"
          >
            <Mic size={16} />
          </button>
        )}
      </div>
      {isDictating && (
        <div className="absolute top-2 left-3 text-xs text-brand-primary font-medium flex items-center gap-1">
          <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
          Listening...
        </div>
      )}
    </div>
  );
};

/* --- Sub Components --- */

const CPDTab: React.FC<{ entries: CPDEntry[], refresh: () => void }> = ({ entries, refresh }) => {
  const [showAdd, setShowAdd] = useState(false);
  
  // Simple form state
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState(1);
  const [participatory, setParticipatory] = useState(false);
  const [reflection, setReflection] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: CPDEntry = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      date: new Date().toISOString().split('T')[0],
      hours,
      participatory,
      reflection,
      category: 'General',
      tags: []
    };
    await dataService.addCPD(newEntry);
    setShowAdd(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-brand-charcoal">CPD Activity Log</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark"
        >
          <Plus size={16} />
          Log Activity
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-brand-charcoal">Activity Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-brand-charcoal">Hours</label>
                <input required type="number" min="0.5" step="0.5" value={hours} onChange={e => setHours(parseFloat(e.target.value))} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" />
             </div>
             <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-brand-charcoal cursor-pointer">
                  <input type="checkbox" checked={participatory} onChange={e => setParticipatory(e.target.checked)} className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                  Participatory Learning
                </label>
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1">Reflection / Notes</label>
            <VoiceInputArea value={reflection} onChange={setReflection} placeholder="Type or dictate your notes here..." />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primaryDark">Save Entry</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-brand-charcoal">{entry.title}</h3>
                  {entry.participatory && <span className="text-[10px] uppercase font-bold bg-brand-cream text-brand-charcoal px-2 py-0.5 rounded-full">Participatory</span>}
                </div>
                <p className="text-sm text-slate-500 mt-1">{entry.date} • {entry.category}</p>
                {entry.reflection && <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100 italic">"{entry.reflection}"</p>}
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-brand-primary">{entry.hours}h</span>
              </div>
            </div>
          </div>
        ))}
        {entries.length === 0 && <p className="text-center text-slate-500 py-10">No CPD entries logged yet.</p>}
      </div>
    </div>
  );
};

// Voice Log Entry Component with Edit and Delete
const VoiceLogEntry: React.FC<{ 
  log: VoiceLog; 
  onDelete: () => void; 
  onEdit: (text: string) => void;
}> = ({ log, onDelete, onEdit }) => {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this voice log?')) {
      onDelete();
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 hover:border-brand-primary/30 transition-colors">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Play size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="line-clamp-2 text-sm text-brand-charcoal font-medium">{log.transcription}</p>
        <p className="text-xs text-slate-500 mt-1">{new Date(log.date).toLocaleDateString()} • {log.suggestedType}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(log.transcription)}
          className="p-2 rounded-lg text-slate-600 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
          title="Edit this voice log"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Delete this voice log"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const VoiceTab: React.FC<{ logs: VoiceLog[], refresh: () => void }> = ({ logs, refresh }) => {
  const [isDictating, setIsDictating] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef<boolean>(false);
  const accumulatedTranscriptRef = useRef<string>(''); // Persistent transcript across restarts

  const startDictation = () => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice dictation. Please use Chrome, Edge, or Safari.");
      return;
    }

    // Initialize accumulated transcript with current transcript if starting fresh
    if (!isDictating) {
      accumulatedTranscriptRef.current = transcript;
    }

    isManuallyStoppedRef.current = false;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-GB'; // British English for UK nurses

    recognition.onstart = () => {
      setIsDictating(true);
      // Don't clear transcript - keep accumulating
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = accumulatedTranscriptRef.current; // Always start from accumulated transcript

      // Process only new results since last event
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        } else {
          interimTranscript += transcriptPart;
        }
      }

      // Update accumulated transcript (only final parts)
      accumulatedTranscriptRef.current = finalTranscript;
      
      // Update state with accumulated + interim
      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // User paused - this is normal, recognition will auto-restart
        return;
      }
      setIsDictating(false);
      if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please enable microphone permissions.");
      }
    };

    recognition.onend = () => {
      // Only restart if it wasn't manually stopped and we're still in dictation mode
      if (!isManuallyStoppedRef.current && isDictating) {
        try {
          // Restart recognition - transcript is preserved in accumulatedTranscriptRef
          recognition.start();
        } catch (e) {
          // Recognition already started or error occurred
          console.log('Recognition restart:', e);
        }
      } else {
        setIsDictating(false);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopDictation = () => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsDictating(false);
    }
    // Keep transcript - don't clear it
  };

  const handleSave = async () => {
    if (!transcript.trim()) {
      alert("Please dictate some text before saving.");
      return;
    }
    
    const log: VoiceLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      durationSeconds: 0,
      transcription: transcript,
      status: 'Processed',
      suggestedType: 'CPD' // Default, user can categorize later
    };
    await dataService.addVoiceLog(log);
    
    // Also add to CPD log automatically
    await dataService.addCPD({
      id: Math.random().toString(36).substr(2, 9),
      title: 'Voice Note Entry',
      date: new Date().toISOString().split('T')[0],
      hours: 0.5,
      participatory: false,
      reflection: transcript,
      category: 'Voice Log',
      tags: ['Voice']
    });

    setTranscript('');
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-primary p-8 text-white">
        <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-all ${isDictating ? 'bg-rose-500 animate-pulse' : 'bg-brand-primaryDark'}`}>
          <Mic size={32} />
        </div>
        
        {!isDictating ? (
          <button onClick={startDictation} className="rounded-full bg-brand-mint px-8 py-3 font-semibold text-brand-primary hover:bg-white transition-colors">
            Start Dictation
          </button>
        ) : (
          <button onClick={stopDictation} className="rounded-full bg-rose-600 px-8 py-3 font-semibold text-white hover:bg-rose-700 transition-colors">
            Stop Dictation
          </button>
        )}
        <p className="mt-4 text-sm text-brand-mint/80">Speak and your words will appear as text in real-time.</p>
      </div>

      {transcript && (
        <div className="rounded-xl border border-brand-mint bg-brand-mint/10 p-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start gap-3 mb-4">
             <Sparkles className="text-brand-primary mt-1" size={20} />
             <div className="flex-1">
               <h3 className="font-semibold text-brand-primary">Dictation Ready</h3>
               <p className="text-sm text-slate-600 mt-1">Review and edit your text, then save.</p>
             </div>
          </div>
          
          <textarea
            className="w-full bg-white rounded-lg p-4 mb-4 border border-slate-200 text-sm text-slate-700 min-h-[120px]"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your dictated text will appear here..."
          />
          
          <div className="flex gap-3">
            <button 
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark transition-colors"
            >
              <Save size={16} /> Save to Log
            </button>
            <button 
              onClick={() => setTranscript('')}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-brand-charcoal">Recent Voice Logs</h3>
        {logs.map(log => (
          <VoiceLogEntry key={log.id} log={log} onDelete={async () => {
            await dataService.deleteVoiceLog(log.id);
            refresh();
          }} onEdit={(editedText) => {
            setTranscript(editedText);
            // Scroll to top to show edit area
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        ))}
        {logs.length === 0 && (
          <p className="text-center text-slate-500 py-10">No voice logs yet. Start dictating to create your first log!</p>
        )}
      </div>
    </div>
  );
};

const ReflectionsTab: React.FC<{ reflections: Reflection[], refresh: () => void }> = ({ reflections, refresh }) => {
  const [step, setStep] = useState<'list' | 'context' | 'questions' | 'preview'>('list');
  const [context, setContext] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finalReflection, setFinalReflection] = useState('');
  const [loading, setLoading] = useState(false);

  const startCoaching = async () => {
    setLoading(true);
    try {
      const qs = await aiService.getReflectionPrompts(context);
      setQuestions(qs);
      setAnswers(new Array(qs.length).fill(''));
      setLoading(false);
      setStep('questions');
    } catch (e) {
      setLoading(false);
      alert("Could not generate questions. Please try again.");
    }
  };

  const generateReflection = async () => {
    setLoading(true);
    const result = await aiService.generateStructuredReflection(context, questions, answers);
    setFinalReflection(result);
    setLoading(false);
    setStep('preview');
  };

  const saveReflection = async () => {
    const newRef: Reflection = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      title: context.substring(0, 30) + '...',
      content: finalReflection,
      tags: ['AI Coached'],
      method: 'Written'
    };
    await dataService.addReflection(newRef);
    refresh();
    setStep('list');
    setContext('');
  };

  return (
    <div className="space-y-6">
      {step === 'list' && (
        <>
          <div className="rounded-xl bg-gradient-to-r from-brand-primary to-brand-primaryDark p-6 text-white shadow-md">
            <h2 className="text-xl font-bold">AI Reflection Coach</h2>
            <p className="mt-2 text-brand-mint/90 opacity-90">
              Not sure how to write your reflection? Tell me briefly what happened, and I'll interview you to build a perfect NMC-compliant entry.
            </p>
            <button 
              onClick={() => setStep('context')}
              className="mt-6 flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-brand-primary hover:bg-brand-mint transition-colors"
            >
              <Sparkles size={18} />
              Start New Reflection
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-brand-charcoal">Your Reflections</h3>
            {reflections.map(ref => (
              <div key={ref.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                 <div className="flex justify-between">
                   <h4 className="font-semibold text-brand-charcoal">{ref.title}</h4>
                   <span className="text-xs text-slate-500">{ref.date}</span>
                 </div>
                 <p className="mt-2 text-sm text-slate-600 whitespace-pre-line line-clamp-3">{ref.content}</p>
                 <button className="mt-3 text-xs font-medium text-brand-primary hover:underline">Read Full Entry</button>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 'context' && (
        <div className="max-w-2xl mx-auto space-y-4">
           <h3 className="text-lg font-bold text-brand-charcoal">What do you want to reflect on?</h3>
           <p className="text-slate-500 text-sm">Briefly describe the event, training, or situation.</p>
           <VoiceInputArea 
             value={context}
             onChange={setContext}
             minRows={5}
             placeholder="e.g. I had a difficult conversation with a patient's family about discharge planning..."
           />
           <button 
             onClick={startCoaching}
             disabled={!context || loading}
             className="w-full rounded-lg bg-brand-primary py-3 text-white font-medium hover:bg-brand-primaryDark disabled:opacity-50"
           >
             {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Next: Generate Questions'}
           </button>
           <button onClick={() => setStep('list')} className="w-full text-slate-500 text-sm py-2">Cancel</button>
        </div>
      )}

      {step === 'questions' && (
         <div className="max-w-2xl mx-auto space-y-6">
           <h3 className="text-lg font-bold text-brand-charcoal">Guiding Questions</h3>
           <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-brand-primary mb-2">{q}</label>
                <VoiceInputArea 
                  value={answers[i]}
                  minRows={3}
                  onChange={(text) => {
                    const newAns = [...answers];
                    newAns[i] = text;
                    setAnswers(newAns);
                  }}
                  placeholder="Type or click the mic to dictate..."
                />
              </div>
            ))}
           </div>
           <button 
             onClick={generateReflection}
             disabled={loading}
             className="w-full rounded-lg bg-brand-primary py-3 text-white font-medium hover:bg-brand-primaryDark disabled:opacity-50"
           >
             {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Generate Structured Reflection'}
           </button>
         </div>
      )}

      {step === 'preview' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-xl border border-brand-mint bg-brand-mint/10 p-6">
            <h3 className="text-lg font-bold text-brand-primary mb-4">Your Reflection</h3>
            <div className="prose prose-sm text-slate-700 whitespace-pre-wrap">
              {finalReflection}
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={() => setStep('questions')} className="flex-1 rounded-lg border border-slate-300 py-3 text-slate-700 font-medium hover:bg-slate-50">Edit Answers</button>
             <button onClick={saveReflection} className="flex-1 rounded-lg bg-brand-primary py-3 text-white font-medium hover:bg-brand-primaryDark">Save to Portfolio</button>
          </div>
        </div>
      )}
    </div>
  );
};

const RecommendationsTab: React.FC<{ recommendations: Recommendation[], profile: UserProfile | null, refresh: () => void }> = ({ recommendations, profile, refresh }) => {
  const [loading, setLoading] = useState(false);

  const getNewRecs = async () => {
    setLoading(true);
    // Mock call using profile data
    const recs = await aiService.getRecommendations(
      profile?.currentBand || 'Band 5',
      'Band 6', // hardcoded target for demo
      'Acute Medicine'
    );
    // This part in a real app would merge or save these recs
    setLoading(false);
    refresh(); // In a real app we'd save the AI result to DB first
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
           <h2 className="text-lg font-semibold text-brand-charcoal">Recommended for You</h2>
           <p className="text-sm text-slate-500">Based on your career path and recent logs.</p>
         </div>
         <button onClick={getNewRecs} className="text-sm text-brand-primary font-medium hover:underline">
           {loading ? 'Analyzing...' : 'Refresh Recommendations'}
         </button>
      </div>

      <div className="grid gap-4">
        {recommendations.map(rec => (
          <div key={rec.id} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cream text-brand-sand">
               <Sparkles size={20} />
            </div>
            <div className="flex-1">
               <h3 className="font-semibold text-brand-charcoal">{rec.title}</h3>
               <p className="text-sm text-slate-500 mt-1">{rec.reason}</p>
               <div className="mt-3 flex gap-2">
                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{rec.type}</span>
                 {rec.estimatedHours && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{rec.estimatedHours} Hours</span>}
               </div>
            </div>
            <button 
              onClick={() => dataService.completeRecommendation(rec.id).then(refresh)}
              className="text-sm font-medium text-brand-primary hover:bg-brand-mint/20 px-3 py-1 rounded-lg transition-colors"
            >
              {rec.status === 'Completed' ? 'Completed' : 'Mark Done'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const RevalidationTab: React.FC<{ cpdEntries: CPDEntry[], reflections: Reflection[], profile: UserProfile | null }> = ({ cpdEntries, reflections, profile }) => {
  const totalHours = cpdEntries.reduce((acc, curr) => acc + curr.hours, 0);
  const participatoryHours = cpdEntries.filter(e => e.participatory).reduce((acc, curr) => acc + curr.hours, 0);
  
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-brand-primary p-6 text-white shadow-lg">
         <h2 className="text-xl font-bold">NMC Revalidation Status</h2>
         <p className="opacity-80">Next renewal: {profile?.revalidationDate || 'Unknown'}</p>
         
         <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-brand-primaryDark/50 p-4 rounded-lg border border-brand-mint/20">
               <p className="text-sm text-brand-mint">Total CPD Hours</p>
               <p className="text-2xl font-bold mt-1">{totalHours} <span className="text-sm font-normal opacity-50">/ 35</span></p>
            </div>
            <div className="bg-brand-primaryDark/50 p-4 rounded-lg border border-brand-mint/20">
               <p className="text-sm text-brand-mint">Participatory</p>
               <p className="text-2xl font-bold mt-1">{participatoryHours} <span className="text-sm font-normal opacity-50">/ 20</span></p>
            </div>
            <div className="bg-brand-primaryDark/50 p-4 rounded-lg border border-brand-mint/20">
               <p className="text-sm text-brand-mint">Reflections</p>
               <p className="text-2xl font-bold mt-1">{reflections.length} <span className="text-sm font-normal opacity-50">/ 5</span></p>
            </div>
            <div className="bg-brand-primaryDark/50 p-4 rounded-lg border border-brand-mint/20">
               <p className="text-sm text-brand-mint">Practice Hours</p>
               <p className="text-2xl font-bold mt-1">450+ <span className="text-sm font-normal opacity-50">/ 450</span></p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
           <h3 className="font-bold text-brand-charcoal mb-4">Requirements Checklist</h3>
           <ul className="space-y-3">
             <li className="flex items-center gap-3">
               <div className={`h-5 w-5 rounded-full flex items-center justify-center ${totalHours >= 35 ? 'bg-brand-mint text-brand-primary' : 'bg-slate-100 text-slate-400'}`}>
                 <CheckCircle size={14} />
               </div>
               <span className="text-sm text-slate-700">35 Hours of CPD</span>
             </li>
             <li className="flex items-center gap-3">
               <div className={`h-5 w-5 rounded-full flex items-center justify-center ${participatoryHours >= 20 ? 'bg-brand-mint text-brand-primary' : 'bg-slate-100 text-slate-400'}`}>
                 <CheckCircle size={14} />
               </div>
               <span className="text-sm text-slate-700">20 Hours Participatory Learning</span>
             </li>
             <li className="flex items-center gap-3">
               <div className={`h-5 w-5 rounded-full flex items-center justify-center ${reflections.length >= 5 ? 'bg-brand-mint text-brand-primary' : 'bg-slate-100 text-slate-400'}`}>
                 <CheckCircle size={14} />
               </div>
               <span className="text-sm text-slate-700">5 Written Reflections</span>
             </li>
           </ul>
        </div>
        
        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center">
           <FileText className="h-12 w-12 text-slate-300 mb-4" />
           <h3 className="font-bold text-brand-charcoal">Generate Revalidation Pack</h3>
           <p className="text-sm text-slate-500 mt-2">Download a PDF summary of your evidence to discuss with your confirmer.</p>
           <button className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
             Export PDF
           </button>
        </div>
      </div>
    </div>
  );
};

export default Learning;