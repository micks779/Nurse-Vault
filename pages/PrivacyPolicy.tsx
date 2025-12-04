import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/login" className="inline-flex items-center gap-2 text-brand-primary hover:underline mb-6">
          <ArrowLeft size={16} />
          Back to Login
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-brand-primary" size={32} />
            <h1 className="text-3xl font-bold text-brand-charcoal">Privacy Policy</h1>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-sm text-slate-500 mb-8"><strong>Last Updated:</strong> December 4, 2025</p>
            
            <div className="space-y-6 text-sm text-slate-700">
              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">1. Introduction</h2>
                <p>NurseVault ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">2. Information We Collect</h2>
                <h3 className="font-semibold mb-2">2.1 Information You Provide</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Account Information:</strong> Name, email address, password</li>
                  <li><strong>Professional Information:</strong> NMC PIN, current role, band, specialty</li>
                  <li><strong>Documents:</strong> Passport scans, certificates, DBS checks, training records</li>
                  <li><strong>Career Data:</strong> Training records, CPD entries, competencies, career goals</li>
                  <li><strong>Voice Logs:</strong> Audio recordings and transcriptions (if used)</li>
                </ul>
                <h3 className="font-semibold mb-2 mt-4">2.2 Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Usage Data:</strong> How you interact with the application</li>
                  <li><strong>Device Information:</strong> Browser type, device type, IP address</li>
                  <li><strong>Session Data:</strong> Login sessions, authentication tokens</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">3. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide and maintain the service</li>
                  <li>Authenticate your identity</li>
                  <li>Store and organize your professional documents</li>
                  <li>Track your training and CPD requirements</li>
                  <li>Generate career progression insights</li>
                  <li>Improve our services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">4. Data Storage and Security</h2>
                <h3 className="font-semibold mb-2">4.1 Storage</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Your data is stored securely in <strong>Supabase</strong> (PostgreSQL database)</li>
                  <li>Files are stored in <strong>Supabase Storage</strong> (encrypted, private buckets)</li>
                  <li>All data is encrypted <strong>at rest</strong> and <strong>in transit</strong> (TLS/HTTPS)</li>
                </ul>
                <h3 className="font-semibold mb-2 mt-4">4.2 Security Measures</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Row Level Security (RLS):</strong> You can only access your own data</li>
                  <li><strong>Authentication:</strong> Secure email/password authentication</li>
                  <li><strong>Encryption:</strong> AES-256 encryption at rest, TLS in transit</li>
                  <li><strong>Access Controls:</strong> User-specific folders and permissions</li>
                  <li><strong>Signed URLs:</strong> Document links expire after 60 seconds</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">5. Data Sharing and Disclosure</h2>
                <p className="font-semibold mb-2">We <strong>DO NOT</strong>:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                  <li>Sell your data to third parties</li>
                  <li>Share your data with advertisers</li>
                  <li>Use your data for marketing without consent</li>
                </ul>
                <p className="font-semibold mb-2">We <strong>MAY</strong> share data:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>With <strong>Supabase</strong> (our hosting provider) - under their privacy policy</li>
                  <li>If required by law or legal process</li>
                  <li>To protect our rights or prevent harm</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">6. Your Rights (GDPR)</h2>
                <p>Under GDPR, you have the right to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate data</li>
                  <li><strong>Erasure:</strong> Request deletion of your data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Object:</strong> Object to processing of your data</li>
                  <li><strong>Restrict:</strong> Restrict processing of your data</li>
                </ul>
                <p className="mt-4">To exercise these rights, contact us or use the account settings to delete your account.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">7. Data Retention</h2>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
                  <li><strong>Deleted Accounts:</strong> Data deleted within 30 days of account deletion</li>
                  <li><strong>Legal Requirements:</strong> Some data may be retained longer if required by law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">8. International Data Transfers</h2>
                <p>Your data may be processed and stored outside the European Economic Area (EEA). We ensure appropriate safeguards are in place through Standard Contractual Clauses (SCCs) and Supabase's GDPR-compliant infrastructure.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">9. Children's Privacy</h2>
                <p>NurseVault is intended for healthcare professionals and is not designed for users under 18. We do not knowingly collect data from children.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">10. Changes to This Policy</h2>
                <p>We may update this Privacy Policy. We will notify you of changes by posting the new policy on this page and updating the "Last Updated" date. For significant changes, we will notify you via email.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">11. Contact Us</h2>
                <p>For privacy concerns or to exercise your rights:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li><strong>Email:</strong> privacy@nursevault.com</li>
                  <li><strong>Security:</strong> security@nursevault.com</li>
                </ul>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600"><strong>By using NurseVault, you agree to this Privacy Policy.</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

