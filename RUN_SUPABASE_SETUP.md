# How to Run Supabase Setup

## Step 1: Run Database Schema

1. Go to your Supabase project: https://app.supabase.com
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Open the file `supabase/schema.sql` from your project
5. Copy **ALL** the contents
6. Paste into the SQL Editor
7. Click **"Run"** (or press Ctrl+Enter)
8. Wait for "Success. No rows returned" message

**This creates all your database tables with security policies!**

## Step 2: Set Up Storage Bucket

1. Still in **SQL Editor**
2. Click **"New query"** again
3. Open the file `supabase/storage-setup.sql`
4. Copy **ALL** the contents
5. Paste into SQL Editor
6. Click **"Run"**

**This creates the storage bucket for file uploads!**

## Step 3: Verify Setup

### Check Tables Were Created:
1. Go to **"Table Editor"** in left sidebar
2. You should see these tables:
   - ✅ profiles
   - ✅ documents
   - ✅ training_records
   - ✅ cpd_entries
   - ✅ competencies
   - ✅ career_paths
   - ✅ career_requirements
   - ✅ voice_logs
   - ✅ reflections
   - ✅ recommendations

### Check Storage Bucket:
1. Go to **"Storage"** in left sidebar
2. You should see:
   - ✅ `vault-files` bucket (private)

## Step 4: Configure Authentication

1. Go to **"Authentication"** → **"Providers"**
2. Make sure **"Email"** is enabled
3. For development, you can disable email confirmation:
   - Go to **"Authentication"** → **"Settings"**
   - Toggle **"Enable email confirmations"** OFF (for testing)
   - In production, keep this ON

## Step 5: Restart Your Dev Server

After running the SQL:
```bash
# Stop server (Ctrl + C)
npm run dev
```

## Troubleshooting

**"relation already exists" error?**
- Tables already exist, that's OK!
- You can continue or drop tables first if needed

**"permission denied" error?**
- Make sure you're running as the project owner
- Check you're in the correct project

**Storage bucket not showing?**
- Refresh the Storage page
- Check the SQL ran successfully
- Try running storage-setup.sql again

**Can't see tables?**
- Refresh the Table Editor
- Check SQL Editor for any errors
- Make sure you ran the full schema.sql

---

**Once both SQL files are run, we'll update the code to use Supabase!** 🚀

