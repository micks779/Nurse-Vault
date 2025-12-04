# Security & Data Protection

## 🔒 Security Measures

### Database Security
- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data (`auth.uid() = user_id`)
- Foreign key constraints with CASCADE deletes
- UUID primary keys (non-sequential)

### Authentication
- **Supabase Auth** (industry-standard, GDPR-compliant)
- Email/password authentication with secure session management
- JWT tokens for API access
- Automatic session refresh

### File Storage
- **Private storage buckets** (not publicly accessible)
- **Signed URLs** that expire after 60 seconds
- **RLS policies** on storage objects
- **User-specific folders** (`user_id` based paths)

### Encryption
- **At Rest:** AES-256 encryption (Supabase default)
- **In Transit:** TLS/HTTPS for all connections
- **Files:** Encrypted storage buckets

### API Security
- **Edge Functions** for AI API calls (hides API keys)
- **Environment variables** for sensitive configuration
- **No API keys exposed** in frontend code

## 📋 Compliance

### GDPR Compliance
- ✅ Data minimization (only collect necessary data)
- ✅ Purpose limitation (clear purpose for data)
- ✅ Storage limitation (30-day deletion policy)
- ✅ Security (encryption, RLS, access controls)
- ✅ User rights (access, rectification, erasure, portability)
- ✅ Privacy by design (built into architecture)
- ✅ Privacy policy and terms of service

### Data Protection
- ✅ No data sharing with third parties
- ✅ No data selling
- ✅ User data isolation (RLS)
- ✅ Secure data transmission (TLS)
- ✅ Secure data storage (encryption)

## 🛡️ User Rights (GDPR)

Users have the right to:
- **Access:** Request a copy of their personal data
- **Rectification:** Correct inaccurate data
- **Erasure:** Request deletion of their account and data
- **Portability:** Export their data in machine-readable format
- **Object:** Object to processing of their data
- **Restrict:** Restrict processing of their data

## 🔐 Security Best Practices

### For Users
- Use a strong, unique password (minimum 8 characters)
- Never share account credentials
- Log out when using shared devices
- Keep browser and device software updated
- Report suspicious activity immediately

### For Developers
- Never commit API keys or secrets to version control
- Use environment variables for sensitive configuration
- Keep dependencies updated
- Follow secure coding practices
- Regular security audits

## 📞 Security Contact

For security concerns or to report vulnerabilities:
- **Email:** security@nursevault.com
- **Response Time:** Within 48 hours

## 🔍 Security Audit

Last audit: December 4, 2025

**Status:** ✅ All critical security measures in place
- Row Level Security: ✅ Enabled
- Encryption: ✅ At rest and in transit
- Authentication: ✅ Secure
- File Storage: ✅ Private with signed URLs
- API Security: ✅ Edge Functions for sensitive operations

## 📄 Legal Documents

- [Privacy Policy](./PRIVACY_POLICY.md)
- [Terms of Service](./TERMS_OF_SERVICE.md)
- [Security Information](./pages/Security.tsx) (User-facing)

---

**We take security seriously. Your professional data is protected.**

