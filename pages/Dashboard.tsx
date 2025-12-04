import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ShieldAlert, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { dataService } from '../services/dataService';
import { TrainingRecord, UserProfile, TrainingStatus } from '../types';
import StatCard from '../components/ui/StatCard';

const Dashboard: React.FC = () => {
  const [training, setTraining] = useState<TrainingRecord[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const tData = await dataService.getTraining();
      const pData = await dataService.getProfile();
      setTraining(tData);
      setProfile(pData);
    };
    loadData();
  }, []);

  const validCount = training.filter(t => t.status === TrainingStatus.VALID).length;
  const expiringCount = training.filter(t => t.status === TrainingStatus.DUE_SOON).length;
  const expiredCount = training.filter(t => t.status === TrainingStatus.EXPIRED).length;

  const chartData = [
    { name: 'Valid', value: validCount, color: '#94D2BD' }, // Mint
    { name: 'Due Soon', value: expiringCount, color: '#EE9B00' }, // Sand
    { name: 'Expired', value: expiredCount, color: '#AE2012' }, // Dark Red (Custom for alert)
  ];

  const cpdData = [
    { name: 'Clinical', hours: 12 },
    { name: 'Safety', hours: 5 },
    { name: 'Leadership', hours: 8 },
    { name: 'Teaching', hours: 3 },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-brand-charcoal">Welcome back, {profile?.name || 'Nurse'}</h1>
        <p className="text-slate-500">Here's your professional compliance overview.</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Overall Compliance" 
          value={`${Math.round((validCount / training.length) * 100)}%`} 
          icon={CheckCircle} 
          color="mint"
          subtitle="2 items need attention"
        />
        <StatCard 
          title="Expiring Soon" 
          value={expiringCount} 
          icon={Clock} 
          color="sand"
          subtitle="Within 90 days"
        />
        <StatCard 
          title="Expired Items" 
          value={expiredCount} 
          icon={ShieldAlert} 
          color="rose"
          subtitle="Action required immediately"
        />
        <StatCard 
          title="CPD Hours" 
          value="24" 
          icon={BookOpen} 
          color="teal"
          subtitle="Target: 35 hours / 3 years"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Compliance Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-brand-charcoal">Training Compliance</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* CPD Progress */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-brand-charcoal">CPD Activity Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cpdData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <RechartsTooltip cursor={{fill: '#FAFAFA'}} />
                <Bar dataKey="hours" fill="#005F73" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-slate-500">
            Total of 28 hours logged this period
          </div>
        </div>
      </div>
      
      {/* Alert Banner */}
      {expiredCount > 0 && (
        <div className="rounded-lg border-l-4 border-rose-500 bg-rose-50 p-4">
          <div className="flex">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-rose-800">Compliance Action Required</h3>
              <div className="mt-2 text-sm text-rose-700">
                <p>You have {expiredCount} expired mandatory training modules. Please update your records or complete the training immediately to maintain compliance.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;