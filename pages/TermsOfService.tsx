import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/login" className="inline-flex items-center gap-2 text-brand-primary hover:underline mb-6">
          <ArrowLeft size={16} />
          Back to Login
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-brand-primary" size={32} />
            <h1 className="text-3xl font-bold text-brand-charcoal">Terms of Service</h1>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-sm text-slate-500 mb-8"><strong>Last Updated:</strong> December 4, 2025</p>
            
            <div className="space-y-6 text-sm text-slate-700">
              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">1. Acceptance of Terms</h2>
                <p>By accessing or using NurseVault ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">2. Description of Service</h2>
                <p>NurseVault is a professional portfolio management application designed for healthcare professionals to store documents, track training, monitor career progression, and organize competencies.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">3. User Accounts</h2>
                <h3 className="font-semibold mb-2">3.1 Account Creation</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You must be at least 18 years old</li>
                  <li>You must be a healthcare professional or student</li>
                </ul>
                <h3 className="font-semibold mb-2 mt-4">3.2 Account Security</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You are responsible for all activities under your account</li>
                  <li>Notify us immediately of unauthorized access</li>
                  <li>Use a strong, unique password</li>
                  <li>Do not share your account credentials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">4. Acceptable Use</h2>
                <p className="font-semibold mb-2">You agree <strong>NOT</strong> to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Upload illegal, harmful, or offensive content</li>
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Attempt to access other users' data</li>
                  <li>Interfere with the Service's operation</li>
                  <li>Use automated systems to access the Service</li>
                  <li>Share your account with others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">5. User Content</h2>
                <h3 className="font-semibold mb-2">5.1 Your Content</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You retain ownership of all content you upload</li>
                  <li>You grant us a license to store and process your content</li>
                  <li>You are responsible for the content you upload</li>
                  <li>You must have the right to upload any content</li>
                </ul>
                <h3 className="font-semibold mb-2 mt-4">5.2 Content Restrictions</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>No confidential patient information</li>
                  <li>No illegal or harmful content</li>
                  <li>No copyrighted material without permission</li>
                  <li>No content that violates privacy rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">6. Data and Privacy</h2>
                <p>Your use of the Service is also governed by our <Link to="/privacy" className="text-brand-primary hover:underline">Privacy Policy</Link>. We implement industry-standard security measures and do not sell your data to third parties.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">7. Limitation of Liability</h2>
                <p className="font-semibold mb-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We provide the Service "as is" without warranties</li>
                  <li>We are not liable for any indirect, incidental, or consequential damages</li>
                  <li>Our total liability is limited to the amount you paid (if any) in the past 12 months</li>
                  <li>We are not responsible for data loss due to user error</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">8. Termination</h2>
                <h3 className="font-semibold mb-2">8.1 By You</h3>
                <p>You may delete your account at any time. Data will be deleted within 30 days.</p>
                <h3 className="font-semibold mb-2 mt-4">8.2 By Us</h3>
                <p>We may terminate or suspend your account if you violate these Terms, engage in fraudulent activity, or as required by law.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">9. Changes to Terms</h2>
                <p>We may modify these Terms at any time. We will post the updated Terms on this page, update the "Last Updated" date, and notify you of significant changes via email.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-charcoal mb-3">10. Contact Information</h2>
                <p>For questions about these Terms:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li><strong>Email:</strong> support@nursevault.com</li>
                  <li><strong>Legal:</strong> legal@nursevault.com</li>
                </ul>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600"><strong>By using NurseVault, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

