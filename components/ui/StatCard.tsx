import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'mint' | 'teal' | 'rose' | 'sand' | 'blue';
}

const COLORS = {
  mint: 'bg-brand-mint/20 text-brand-primary',
  teal: 'bg-brand-primary/10 text-brand-primary',
  rose: 'bg-rose-50 text-rose-700',
  sand: 'bg-brand-sand/10 text-brand-sand',
  blue: 'bg-blue-50 text-blue-700', // keeping as fallback
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color = 'teal' }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-brand-charcoal">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${COLORS[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      {subtitle && (
        <p className="mt-4 text-xs font-medium text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;