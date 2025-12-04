import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import { TrainingRecord, TrainingStatus } from '../types';
import { AlertCircle, CheckCircle, Clock, X, Plus, Loader2 } from 'lucide-react';

const Training: React.FC = () => {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    courseName: '',
    provider: '',
    dateCompleted: '',
    expiryDate: '',
    category: 'Mandatory Training'
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const trainingRecords = await dataService.getTraining();
      setRecords(trainingRecords);
    } catch (error) {
      console.error('Error loading training records:', error);
    }
  };

  const getStatusColor = (status: TrainingStatus) => {
    switch (status) {
      case TrainingStatus.VALID: return 'bg-brand-mint/20 text-teal-800 border-brand-mint/30';
      case TrainingStatus.DUE_SOON: return 'bg-brand-sand/10 text-brand-sand border-brand-sand/20';
      case TrainingStatus.EXPIRED: return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getStatusIcon = (status: TrainingStatus) => {
    switch (status) {
      case TrainingStatus.VALID: return <CheckCircle size={16} />;
      case TrainingStatus.DUE_SOON: return <Clock size={16} />;
      case TrainingStatus.EXPIRED: return <AlertCircle size={16} />;
    }
  };

  const calculateStatus = (expiryDate: string): TrainingStatus => {
    if (!expiryDate) return TrainingStatus.VALID;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return TrainingStatus.EXPIRED;
    } else if (daysUntilExpiry <= 30) {
      return TrainingStatus.DUE_SOON;
    } else {
      return TrainingStatus.VALID;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.courseName || !formData.provider || !formData.dateCompleted || !formData.expiryDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const status = calculateStatus(formData.expiryDate);
      
      await dataService.addTraining({
        courseName: formData.courseName,
        provider: formData.provider,
        dateCompleted: formData.dateCompleted,
        expiryDate: formData.expiryDate,
        category: formData.category,
        status
      });
      
      // Refresh records
      await loadRecords();
      
      // Reset form and close modal
      setFormData({
        courseName: '',
        provider: '',
        dateCompleted: '',
        expiryDate: '',
        category: 'Mandatory Training'
      });
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Error adding training record:', error);
      alert(error.message || 'Failed to add training record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Mandatory Training</h1>
          <p className="text-slate-500">Track expiry dates and compliance status.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark transition-colors"
        >
          <Plus size={18} />
          Add Record
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Course</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Provider</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date Completed</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Expires</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-brand-charcoal">{record.courseName}</div>
                  <div className="text-xs text-slate-500">{record.category}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{record.provider}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{record.dateCompleted}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{record.expiryDate}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(record.status)}`}>
                    {getStatusIcon(record.status)}
                    {record.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <a href="#" className="text-brand-primary hover:text-brand-primaryDark">Update</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {records.map((record) => (
          <div key={record.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-brand-charcoal truncate">{record.courseName}</h3>
                <p className="text-xs text-slate-500 mt-1">{record.category}</p>
              </div>
              <span className={`ml-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium flex-shrink-0 ${getStatusColor(record.status)}`}>
                {getStatusIcon(record.status)}
                {record.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Provider:</span>
                <span className="text-brand-charcoal font-medium">{record.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date Completed:</span>
                <span className="text-brand-charcoal font-medium">{record.dateCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expires:</span>
                <span className="text-brand-charcoal font-medium">{record.expiryDate}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-slate-100">
              <a href="#" className="text-sm text-brand-primary hover:text-brand-primaryDark">Update</a>
            </div>
          </div>
        ))}
      </div>

      {records.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Clock size={24} />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-brand-charcoal">No training records</h3>
          <p className="mt-1 text-sm text-slate-500">Click "Add Record" to track your mandatory training.</p>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !isSubmitting && setShowAddModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-brand-charcoal">Add Training Record</h2>
              <button
                onClick={() => !isSubmitting && setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.courseName}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="e.g., Fire Safety, Manual Handling"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                  Provider <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.provider}
                  onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="e.g., NHS Trust, External Provider"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  disabled={isSubmitting}
                >
                  <option value="Mandatory Training">Mandatory Training</option>
                  <option value="Clinical Skills">Clinical Skills</option>
                  <option value="Safeguarding">Safeguarding</option>
                  <option value="Health & Safety">Health & Safety</option>
                  <option value="IT & Digital">IT & Digital</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1">
                    Date Completed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateCompleted}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateCompleted: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    max={new Date().toISOString().split('T')[0]}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    min={formData.dateCompleted || new Date().toISOString().split('T')[0]}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-200 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add Record
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;