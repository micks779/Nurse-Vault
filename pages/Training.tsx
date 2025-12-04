import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import { TrainingRecord, TrainingStatus } from '../types';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Training: React.FC = () => {
  const [records, setRecords] = useState<TrainingRecord[]>([]);

  useEffect(() => {
    dataService.getTraining().then(setRecords);
  }, []);

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

  return (
    <div className="space-y-6">
       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Mandatory Training</h1>
          <p className="text-slate-500">Track expiry dates and compliance status.</p>
        </div>
        <button className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primaryDark">
          Add Record
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
    </div>
  );
};

export default Training;