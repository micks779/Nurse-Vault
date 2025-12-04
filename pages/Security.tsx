import React from 'react';
import { Shield, Lock, Database, Eye, FileCheck, CheckCircle } from 'lucide-react';

const Security: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-brand-charcoal mb-2">Security & Data Protection</h1>
        <p className="text-slate-600">How we protect your sensitive professional data</p>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-brand-primary/10">
              <Lock className="text-brand-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold text-brand-charcoal">Encryption</h2>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>At Rest:</strong> AES-256 encryption for all stored data</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>In Transit:</strong> TLS/HTTPS for all data transfers</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>Files:</strong> Encrypted storage buckets with signed URLs</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-brand-primary/10">
              <Database className="text-brand-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold text-brand-charcoal">Access Control</h2>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>Row Level Security:</strong> You can only access your own data</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>Authentication:</strong> Secure email/password with JWT tokens</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>User Isolation:</strong> Data stored in user-specific folders</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-brand-primary/10">
              <Shield className="text-brand-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold text-brand-charcoal">Compliance</h2>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>GDPR Compliant:</strong> Your data, your rights</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>Data Minimization:</strong> We only collect what's necessary</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>Right to Deletion:</strong> Delete your account anytime</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-brand-primary/10">
              <Eye className="text-brand-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold text-brand-charcoal">Privacy</h2>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>No Data Sharing:</strong> We don't sell your data</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>Private Storage:</strong> Documents in private, encrypted buckets</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-brand-primary mt-0.5" size={16} />
              <span><strong>Signed URLs:</strong> Document links expire after 60 seconds</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Your Rights */}
      <div className="rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6">
        <h2 className="text-xl font-bold text-brand-charcoal mb-4 flex items-center gap-2">
          <FileCheck className="text-brand-primary" size={24} />
          Your Data Rights (GDPR)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-brand-charcoal mb-2">Access</h3>
            <p className="text-slate-600">Request a copy of all your personal data</p>
          </div>
          <div>
            <h3 className="font-semibold text-brand-charcoal mb-2">Rectification</h3>
            <p className="text-slate-600">Correct any inaccurate information</p>
          </div>
          <div>
            <h3 className="font-semibold text-brand-charcoal mb-2">Erasure</h3>
            <p className="text-slate-600">Request deletion of your account and data</p>
          </div>
          <div>
            <h3 className="font-semibold text-brand-charcoal mb-2">Portability</h3>
            <p className="text-slate-600">Export your data in a machine-readable format</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          To exercise these rights, contact us or use the account settings to delete your account.
        </p>
      </div>

      {/* Security Best Practices */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-brand-charcoal mb-4">Security Best Practices</h2>
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <CheckCircle className="text-brand-primary mt-0.5" size={16} />
            <span>Use a strong, unique password (minimum 8 characters)</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-brand-primary mt-0.5" size={16} />
            <span>Never share your account credentials with anyone</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-brand-primary mt-0.5" size={16} />
            <span>Log out when using shared devices</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-brand-primary mt-0.5" size={16} />
            <span>Keep your browser and device software updated</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="text-brand-primary mt-0.5" size={16} />
            <span>Report any suspicious activity immediately</span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
        <h2 className="text-lg font-bold text-brand-charcoal mb-2">Questions About Security?</h2>
        <p className="text-sm text-slate-600 mb-4">
          Review our <a href="#/privacy" className="text-brand-primary hover:underline">Privacy Policy</a> and <a href="#/terms" className="text-brand-primary hover:underline">Terms of Service</a>
        </p>
        <p className="text-sm text-slate-500">
          For security concerns, contact: <a href="mailto:security@nursevault.com" className="text-brand-primary hover:underline">security@nursevault.com</a>
        </p>
      </div>
    </div>
  );
};

export default Security;

