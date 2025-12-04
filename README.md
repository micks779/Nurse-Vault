<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NurseVault

<div align="center">
  <h2>Professional Portfolio Management for Healthcare Professionals</h2>
  <p>Securely store documents, track training, and manage your career progression</p>
</div>

## 🔒 Security & Compliance

NurseVault is built with security and data protection as top priorities:

- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **Encryption** - AES-256 at rest, TLS in transit
- ✅ **GDPR Compliant** - Full user rights and data protection
- ✅ **Private Storage** - Encrypted file storage with signed URLs
- ✅ **Secure Authentication** - Supabase Auth with JWT tokens

**See [SECURITY.md](./SECURITY.md) for detailed security information.**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account (free tier works)
- Google Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/micks779/Nurse-Vault.git
   cd Nurse-Vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

4. **Set up Supabase database**
   
   - Go to Supabase Dashboard → SQL Editor
   - Run `supabase/schema.sql`
   - Run `supabase/storage-setup.sql`
   - Run `supabase/add-salary-columns.sql` (for career pathway)

5. **Run the app**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3003
   ```

## 📚 Documentation

- [Security & Compliance](./SECURITY.md)
- [Privacy Policy](./PRIVACY_POLICY.md)
- [Terms of Service](./TERMS_OF_SERVICE.md)
- [Local Development Guide](./LOCAL_DEVELOPMENT.md)
- [Deployment Guide](./DEPLOY_CHECKLIST.md)

## 🏗️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **AI:** Google Gemini API (via Edge Functions)
- **PWA:** Service Workers, Web App Manifest

## ✨ Features

- 📄 **Document Management** - Store and organize professional documents
- 📚 **Training Tracker** - Track mandatory training and expiry dates
- 🎓 **CPD Logging** - Record continuing professional development
- ✅ **Competency Tracking** - Monitor skills and competencies
- 📈 **Career Pathway** - Plan and track career progression
- 🤖 **AI Features** - Voice notes, reflections, recommendations
- 📱 **PWA** - Installable, works offline

## 🔐 Security Features

- Row Level Security (RLS) on all database tables
- Encrypted file storage with signed URLs
- Secure authentication with Supabase Auth
- API keys stored server-side (Edge Functions)
- GDPR compliant data handling

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines]

## 📞 Support

- **Email:** support@nursevault.com
- **Security:** security@nursevault.com
- **Privacy:** privacy@nursevault.com

---

**Built with security and privacy in mind. Your professional data is protected.**
